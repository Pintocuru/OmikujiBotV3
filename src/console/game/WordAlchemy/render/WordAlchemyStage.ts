// src/console/game/WordAlchemy/render/WordAlchemyStage.ts
// 盤面。Excalibur のアクターがそのままゲームの状態になる (進行と、外とのやりとりを、ここ 1 か所で持つ)。
// 外との契約 (型)・寸法と座標の補助・演出の層 (浮かぶ文字・完成のカード) は、stage/ に分離した。
// 非表示の間は rAF が止まり、再表示の最初のフレームも Excalibur が丸める (200ms 超は 1ms) ので、ゲームも止まる
import { Actor, Canvas, Color, DisplayMode, EmitterType, Engine, ParticleEmitter, vec } from 'excalibur'
import { isMoveKey, resolveInput } from '../../common/heroInput'
import type { PotLook } from '../maps/WordAlchemyPotMap'
import {
  BREW_SECONDS,
  CELL_PX,
  FALL_EXTRA_CELLS,
  FALL_SECONDS,
  GRID_COLS,
  GRID_ROWS,
  HERO_MOVE_INTERVAL_SECONDS,
  HERO_START,
  MOVE_ANIM_SECONDS,
  POT_COL,
  POT_INGREDIENTS,
  POT_ROW,
  POT_SIZE,
  PUSH_WAVE_DELAY_SECONDS,
  WORD_MAX,
} from '../scripts/wordAlchemyConstants'
import { splitWords } from '../scripts/words'
import { BOARD_BACKGROUND, drawBoard, drawHero, drawPot, drawWord } from './draw'
import { loadTileSheet } from './boardTiles'
import {
  playBrewDone,
  playBrewStart,
  playIntake,
  playLand,
  playReject,
  playSpawn,
  playSteam,
  playWordGone,
  type BurstOptions,
  type EffectHost,
  type PopupOptions,
} from './effectPresets'
import type { SoundKey } from './stageSounds'
import { WordAlchemyAudio } from './WordAlchemyAudio'
import {
  BOARD_H,
  BOARD_W,
  POT_CENTER,
  POT_TOP,
  cellCenter,
  clamp,
  hslToRgb,
  inGrid,
  inPot,
  isRing,
  isTyping,
  lerp,
} from './stage/stageGeometry'
import type { BrewHandler, BrewMaterial, BrewOutcome, StageOptions, Word, WordSpawnRequest } from './stage/stageTypes'
import { PopupLayer } from './stage/popupLayer'
import { showResultCard } from './stage/resultCard'

export type { BrewHandler, BrewMaterial, BrewOutcome, StageOptions, WordSpawnRequest } from './stage/stageTypes'

/** 煮込み中の湯気を出す間隔 (秒) */
const STEAM_INTERVAL_SECONDS = 0.3

export class WordAlchemyStage implements EffectHost {
  private readonly engine: Engine
  private readonly heroActor: Actor
  private readonly audio = new WordAlchemyAudio()
  /** 盤面の素材 (読み込めるまでは null) */
  private tileSheet: HTMLImageElement | null = null
  private readonly popups = new PopupLayer()
  private lastSteamAt = 0
  private readonly words: Word[] = []
  private readonly held: string[] = []
  private readonly hero = { col: HERO_START.col, row: HERO_START.row, cooldown: 0 }
  private readonly pot = {
    ingredients: [] as BrewMaterial[],
    /** 材料が揃って、「この内容で煮込みますか?」の答え待ち */
    confirming: false,
    brewing: false,
    endsAt: 0,
    result: undefined as BrewOutcome | undefined,
    reserved: 0,
  }
  private heroX = NaN
  private heroY = NaN
  /** ゲーム内の時計 (秒)。更新が止まっている間 (非表示) は進まない */
  private clock = 0
  private running = false
  /** やめた・始め直したあとに、前のゲームの煮込みの結果が届いても無視するための番号 */
  private runId = 0
  private disposed = false

  constructor(
    canvas: HTMLCanvasElement,
    private readonly options: StageOptions
  ) {
    this.engine = new Engine({
      canvasElement: canvas,
      width: BOARD_W,
      height: BOARD_H,
      displayMode: DisplayMode.FitContainerAndFill,
      backgroundColor: Color.fromHex(BOARD_BACKGROUND),
      suppressPlayButton: true,
    })

    const board = new Actor({ pos: vec(BOARD_W / 2, BOARD_H / 2), width: BOARD_W, height: BOARD_H, z: 0 })
    const boardCanvas = new Canvas({
      width: BOARD_W,
      height: BOARD_H,
      cache: true,
      draw: (ctx) => drawBoard(ctx, BOARD_W, BOARD_H, this.tileSheet),
    })
    board.graphics.use(boardCanvas)
    this.engine.add(board)
    // 素材は、読み込めたら描き直す (読み込めなければ、仮の見た目のまま)
    void loadTileSheet().then((sheet) => {
      if (!sheet || this.disposed) return
      this.tileSheet = sheet
      boardCanvas.flagDirty()
    })

    const potSize = POT_SIZE * CELL_PX
    const potActor = new Actor({
      pos: vec((POT_COL + POT_SIZE / 2) * CELL_PX, (POT_ROW + POT_SIZE / 2) * CELL_PX),
      width: potSize,
      height: potSize,
      z: 10,
    })
    potActor.graphics.use(
      new Canvas({
        width: potSize,
        height: potSize,
        cache: false,
        draw: (ctx) =>
          drawPot(ctx, this.pot.ingredients.length, this.pot.brewing, this.clock, this.options.potLook?.()),
      })
    )
    this.engine.add(potActor)

    this.heroActor = new Actor({ pos: vec(-1000, -1000), width: CELL_PX, height: CELL_PX, z: 1000 })
    this.heroActor.graphics.use(new Canvas({ width: CELL_PX, height: CELL_PX, cache: true, draw: drawHero }))
    this.heroActor.graphics.isVisible = false
    this.engine.add(this.heroActor)

    window.addEventListener('keydown', this.onKeydown)
    window.addEventListener('keyup', this.onKeyup)
    window.addEventListener('blur', this.clearKeys)
    this.engine.currentScene.on('preupdate', (event) => this.update(event.elapsed / 1000))
    void this.engine.start()
  }

  // ---- 外から呼ぶ ----

  start(): void {
    this.reset()
    this.running = true
    this.heroActor.graphics.isVisible = true
  }

  stop(): void {
    this.running = false
    this.reset()
    this.heroActor.graphics.isVisible = false
  }

  /**
   * コメントを「ことば」にして、空いているマスに降らせる (ゲーム中だけ)。
   * 盤面が満載 (WORD_MAX 個、または空きマスなし) のときは、古いことばを消さず、新しいことばを降らせない
   */
  spawn(request: WordSpawnRequest): void {
    if (!this.running) return
    let added = false
    for (const text of splitWords(request.comment)) {
      if (this.words.filter((w) => !w.exit).length >= WORD_MAX) break
      const cell = this.randomFreeCell()
      if (!cell) break
      this.addWord(request.userId, request.userName, text, cell)
      added = true
    }
    if (added) playSpawn(this)
  }

  /**
   * 煮込みの確認への答え。yes なら煮込みを始め、no なら 3 つの材料は消える (消費される)。確認中でなければ何もしない。
   * 確認の間も、盤面は止まらない (ことばは降り続け、主人公も動ける)
   */
  confirm(yes: boolean): void {
    if (!this.running || !this.pot.confirming) return
    this.pot.confirming = false
    this.options.onConfirmChange?.(null)
    const ingredients = this.pot.ingredients.splice(0)
    if (yes) this.startBrew(ingredients)
    else playReject(this, POT_CENTER)
  }

  /**
   * 鍋の中身を捨てる (鍋の種類を変えるとき)。入っている材料・押し込み中のことば・煮込みの確認が消える。盤面のことばは残る。
   * 煮込み中のもの (材料はすでに使われている) は、そのまま続ける
   */
  clearPot(): void {
    const pot = this.pot
    const had = pot.ingredients.length > 0 || pot.reserved > 0
    for (const w of [...this.words]) if (w.exit === 'pot') this.removeWord(w)
    if (pot.confirming) this.options.onConfirmChange?.(null)
    Object.assign(pot, { ingredients: [], confirming: false, reserved: 0 })
    if (had) playReject(this, POT_CENTER)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    window.removeEventListener('keydown', this.onKeydown)
    window.removeEventListener('keyup', this.onKeyup)
    window.removeEventListener('blur', this.clearKeys)
    this.engine.stop()
    this.engine.dispose()
    this.popups.clear()
  }

  // ---- EffectHost (演出の実体。何を出すかは effectPresets.ts が決める) ----

  play(key: SoundKey): void {
    this.audio.play(key)
  }

  shake(magnitude: number, durationMs: number): void {
    this.engine.currentScene.camera.shake(magnitude, magnitude, durationMs)
  }

  burst(o: BurstOptions): void {
    const emitter = new ParticleEmitter({
      pos: vec(o.x, o.y),
      z: 900,
      emitterType: EmitterType.Circle,
      radius: o.radius,
      isEmitting: false,
      particle: {
        life: o.lifeMs,
        fade: true,
        minSpeed: o.minSpeed,
        maxSpeed: o.maxSpeed,
        minAngle: o.minAngle ?? 0,
        maxAngle: o.maxAngle ?? Math.PI * 2,
        minSize: o.minSize,
        maxSize: o.maxSize,
        beginColor: Color.fromRGB(...hslToRgb(o.hue, o.saturation, o.lightness)),
        endColor: Color.fromRGB(...hslToRgb(o.hue, o.saturation, Math.max(10, o.lightness - 25))),
      },
    })
    this.engine.currentScene.add(emitter)
    emitter.emitParticles(o.count)
    // 粒が消えたあと、エミッターごと片付ける
    emitter.actions.delay(o.lifeMs + 200).die()
  }

  popup(o: PopupOptions): void {
    this.popups.add(this.engine, o)
  }

  // ---- キー入力 (WASD) ----

  private readonly onKeydown = (event: KeyboardEvent) => {
    // 煮込みの確認: Enter で煮込む / Esc でやめる (盤面のボタンでも答えられる)
    if (this.running && this.pot.confirming && !isTyping(event.target)) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Escape') {
        event.preventDefault()
        this.confirm(event.code !== 'Escape')
        return
      }
    }
    if (!isMoveKey(event.code) || isTyping(event.target)) return
    if (this.running) event.preventDefault()
    if (!this.held.includes(event.code)) this.held.push(event.code)
  }
  private readonly onKeyup = (event: KeyboardEvent) => {
    const i = this.held.indexOf(event.code)
    if (i >= 0) this.held.splice(i, 1)
  }
  /** ウィンドウが外れたとき、キーを離したことが伝わらず、押しっぱなしになるのを防ぐ */
  private readonly clearKeys = () => {
    this.held.length = 0
  }

  // ---- 進行 ----

  private reset(): void {
    for (const w of this.words) w.actor.kill()
    this.words.length = 0
    if (this.pot.confirming) this.options.onConfirmChange?.(null)
    Object.assign(this.pot, {
      ingredients: [],
      confirming: false,
      brewing: false,
      endsAt: 0,
      result: undefined,
      reserved: 0,
    })
    this.popups.clear()
    Object.assign(this.hero, { col: HERO_START.col, row: HERO_START.row, cooldown: 0 })
    this.heroX = NaN
    this.held.length = 0
    this.runId++
  }

  private update(dt: number): void {
    if (this.disposed) return
    this.clock += dt
    if (this.running) {
      this.stepHero(dt)
      this.stepPot()
    }
    this.popups.sync(dt)
    this.syncWords()
    this.syncHero(dt)
  }

  private stepHero(dt: number): void {
    const hero = this.hero
    hero.cooldown = Math.max(0, hero.cooldown - dt)
    const { dx, dy } = resolveInput(this.held)
    if ((dx !== 0 || dy !== 0) && hero.cooldown === 0) this.tryMove(dx, dy)
  }

  /**
   * (dx, dy) へ 1 マス動く。鍋と盤面の外へは動けない。向きにことばが並んでいれば、まとめて 1 マス押す (連鎖)。
   * 押した列の先が、縁 (外周) なら一番先のことばが消え、鍋なら一番先のことばが鍋に入る
   * (縁に入ったことばは、縁に沿ってしか動かせず、鍋に入れられなくなるため。ことばは縁に置かない)
   */
  private tryMove(dx: number, dy: number): void {
    const hero = this.hero
    const col = hero.col + dx
    const row = hero.row + dy
    if (!inGrid(col, row) || inPot(col, row)) return

    const chain: Word[] = []
    let c = col
    let r = row
    for (let w = this.wordAt(c, r); w; w = this.wordAt(c, r)) {
      chain.push(w)
      c += dx
      r += dy
    }
    const last = chain[chain.length - 1]
    // 鍋が閉じている (確認待ち・煮込み中・材料が揃う予定) ときは、鍋へ押しても動かない (鍋は障害物のまま)
    if (last && inPot(c, r) && !this.canIntake()) return
    chain.forEach((w, i) => this.moveWord(w, w.col + dx, w.row + dy, i * PUSH_WAVE_DELAY_SECONDS))
    if (last && isRing(c, r)) last.exit = 'out'
    else if (last && inPot(c, r)) this.intake(last)

    hero.col = col
    hero.row = row
    hero.cooldown = HERO_MOVE_INTERVAL_SECONDS
  }

  private wordAt(col: number, row: number): Word | undefined {
    return this.words.find((w) => !w.exit && w.col === col && w.row === row)
  }

  private moveWord(w: Word, col: number, row: number, delaySeconds: number): void {
    w.prevCol = w.col
    w.prevRow = w.row
    w.col = col
    w.row = row
    w.movedAt = this.clock + delaySeconds
  }

  // ---- ことば ----

  private randomFreeCell(): { col: number; row: number } | null {
    const free: { col: number; row: number }[] = []
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const isHero = col === this.hero.col && row === this.hero.row
        if (!isHero && !isRing(col, row) && !inPot(col, row) && !this.wordAt(col, row)) free.push({ col, row })
      }
    }
    return free.length ? free[Math.floor(Math.random() * free.length)] : null
  }

  /** 盤面の上から落ちてくる */
  private addWord(userId: string, userName: string, text: string, cell: { col: number; row: number }): void {
    const actor = new Actor({ pos: vec(-1000, -1000), width: CELL_PX, height: CELL_PX, z: 50 })
    actor.graphics.use(new Canvas({ width: CELL_PX, height: CELL_PX, cache: true, draw: (ctx) => drawWord(ctx, text) }))
    this.engine.add(actor)
    this.words.push({
      userId,
      userName,
      text,
      col: cell.col,
      row: cell.row,
      prevCol: cell.col,
      prevRow: cell.row,
      movedAt: this.clock,
      fallStartedAt: this.clock,
      exit: null,
      actor,
    })
  }

  private removeWord(w: Word): void {
    w.actor.kill()
    this.words.splice(this.words.indexOf(w), 1)
  }

  /** 動き終わった (縁へ出た・鍋に入った) ことばを片付ける。鍋に入ったものは、ここで材料になる。材料が揃ったら、煮込みの確認を出す */
  private finishExit(w: Word): void {
    this.removeWord(w)
    if (w.exit === 'out') {
      playWordGone(this, cellCenter(w.col, w.row))
      return
    }
    this.pot.reserved--
    this.pot.ingredients.push({ text: w.text, userId: w.userId, userName: w.userName })
    playIntake(this, { top: POT_TOP, center: POT_CENTER }, this.pot.ingredients.length)
    if (this.pot.ingredients.length >= POT_INGREDIENTS) {
      this.pot.confirming = true
      this.options.onConfirmChange?.([...this.pot.ingredients])
    }
  }

  private syncWords(): void {
    for (const w of [...this.words]) {
      const t = clamp((this.clock - w.movedAt) / MOVE_ANIM_SECONDS, 0, 1)
      if (w.exit && t >= 1) {
        this.finishExit(w)
        continue
      }
      const eased = 1 - (1 - t) * (1 - t)
      const x = (lerp(w.prevCol, w.col, eased) + 0.5) * CELL_PX
      let y = (lerp(w.prevRow, w.row, eased) + 0.5) * CELL_PX
      let opacity = 1
      if (w.fallStartedAt !== null) {
        const fallT = clamp((this.clock - w.fallStartedAt) / FALL_SECONDS, 0, 1)
        y -= (w.row + 1 + FALL_EXTRA_CELLS) * CELL_PX * (1 - fallT * fallT)
        opacity = clamp(fallT * 4, 0, 1)
        if (fallT >= 1) {
          w.fallStartedAt = null
          playLand(this, cellCenter(w.col, w.row))
        }
      }
      const scale = w.exit === 'pot' ? 1 - 0.6 * eased : 1
      w.actor.pos = vec(x, y)
      w.actor.scale = vec(scale, scale)
      w.actor.graphics.opacity = opacity
    }
  }

  private syncHero(dt: number): void {
    const targetX = (this.hero.col + 0.5) * CELL_PX
    const targetY = (this.hero.row + 0.5) * CELL_PX
    if (Number.isNaN(this.heroX)) {
      this.heroX = targetX
      this.heroY = targetY
    }
    const follow = Math.min(1, dt / (HERO_MOVE_INTERVAL_SECONDS * 0.6))
    this.heroX += (targetX - this.heroX) * follow
    this.heroY += (targetY - this.heroY) * follow
    this.heroActor.pos = vec(this.heroX, this.heroY)
  }

  // ---- 鍋 ----

  /** 鍋が、ことばを受け付けられるか。確認待ち・煮込み中・材料が揃う予定 (動いている途中のものを含む) のときは、受け付けない */
  private canIntake(): boolean {
    return (
      !this.pot.confirming && !this.pot.brewing && this.pot.ingredients.length + this.pot.reserved < POT_INGREDIENTS
    )
  }

  /** 鍋に押し込まれたことば (canIntake を確かめたあと)。動き終わったら、材料になる */
  private intake(w: Word): void {
    w.exit = 'pot'
    this.pot.reserved++
  }

  private startBrew(ingredients: BrewMaterial[]): void {
    const run = this.runId
    playBrewStart(this, { top: POT_TOP, center: POT_CENTER })
    this.lastSteamAt = this.clock
    Object.assign(this.pot, { brewing: true, endsAt: this.clock + BREW_SECONDS, result: undefined })
    this.options
      .brew(ingredients)
      .catch((): BrewOutcome => ({ title: '…', kind: 'lost' }))
      .then((result) => {
        if (run === this.runId) this.pot.result = result
      })
  }

  /** 結果が届いていて、最短の時間も過ぎたら、完成 */
  private stepPot(): void {
    const pot = this.pot
    if (pot.brewing && this.clock - this.lastSteamAt >= STEAM_INTERVAL_SECONDS) {
      this.lastSteamAt = this.clock
      playSteam(this, { x: POT_CENTER.x, y: POT_ROW * CELL_PX + CELL_PX * 0.7 })
    }
    if (!pot.brewing || pot.result === undefined || this.clock < pot.endsAt) return
    pot.brewing = false
    playBrewDone(this, pot.result.kind, POT_CENTER)
    showResultCard(this.engine, pot.result, POT_TOP.x, POT_TOP.y)
    pot.result.onShown?.()
  }
}
