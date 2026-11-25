// src/console/game/WordAlchemy/render/WordAlchemyStage.ts
// 盤面。Excalibur のアクターがそのままゲームの状態になる (進行・描画・演出を、ここ 1 か所で持つ)。
// 外とのやりとりは、start / stop / spawn と、材料から名前を作る brew (非同期) だけ。
// 非表示の間は rAF が止まり、再表示の最初のフレームも Excalibur が丸める (200ms 超は 1ms) ので、ゲームも止まる
import { Actor, Canvas, Color, DisplayMode, EmitterType, Engine, ParticleEmitter, vec } from 'excalibur'
import { isMoveKey, resolveInput } from '../../common/heroInput'
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
  RESULT_SHOW_SECONDS,
  WORD_MAX,
} from '../scripts/wordAlchemyConstants'
import { splitWords } from '../scripts/words'
import { BOARD_BACKGROUND, drawBoard, drawHero, drawPot, drawWord } from './draw'
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

export type WordSpawnRequest = { userId: string; userName: string; comment: string }
/** 鍋に入れた材料 (ことばと、それを出した視聴者名) */
export type BrewMaterial = { text: string; userId: string; userName: string }
/** 煮込みの結果。鍋の上に出すカード (new: 新種 / known: 既発見 / lost: 抽選エラー) */
export type BrewOutcome = { title: string; subtitle?: string; kind: 'new' | 'known' | 'lost' }
/** 材料から完成品を決める (非同期。reject しない前提。万一 reject したら、抽選エラーと同じ扱い) */
export type BrewHandler = (materials: BrewMaterial[]) => Promise<BrewOutcome>
export type StageOptions = {
  brew: BrewHandler
  /** 鍋が受け付けることばか (受け付けなければ、鍋が投げ飛ばす)。既定は何でも受け付ける */
  accepts?: (text: string) => boolean
}

const BOARD_W = GRID_COLS * CELL_PX
/** 結果のカードの縁の色 (新種は金、既発見は灰、抽選エラーは紫) */
const RESULT_ACCENT: Readonly<Record<BrewOutcome['kind'], string>> = {
  new: '#ffd34d',
  known: '#9aa4b2',
  lost: '#b07cff',
}
const BOARD_H = GRID_ROWS * CELL_PX

/** 盤面の「ことば」1 つ。位置はマス単位 (動き出す時刻までは、直前のマスにいるように見せる) */
type Word = {
  userId: string
  userName: string
  text: string
  col: number
  row: number
  prevCol: number
  prevRow: number
  /** 動き出す時刻 (clock の秒。連鎖のウェーブでは未来) */
  movedAt: number
  /** 落下の開始時刻。null なら落下は終わっている */
  fallStartedAt: number | null
  /** 縁 (外周) / 鍋へ向かっている途中。動き終わったら消える (マスは占めない) */
  exit: 'out' | 'pot' | null
  /** 鍋が受け付けなかった (消える代わりに、空いているマスへ投げ飛ばされる) */
  rejected: boolean
  actor: Actor
}

/** 浮かぶ文字の同時数の上限 (一度に続いても、画面が文字だらけにならないように) */
const POPUP_MAX = 20
/** 煮込み中の湯気を出す間隔 (秒) */
const STEAM_INTERVAL_SECONDS = 0.3
const POT_CENTER = { x: (POT_COL + POT_SIZE / 2) * CELL_PX, y: (POT_ROW + POT_SIZE / 2) * CELL_PX }
const POT_TOP = { x: POT_CENTER.x, y: POT_ROW * CELL_PX - 4 }
const cellCenter = (col: number, row: number) => ({ x: (col + 0.5) * CELL_PX, y: (row + 0.5) * CELL_PX })

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
/** 色相 0〜360・彩度・明るさ 0〜100 → RGB (0〜255) */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const sat = s / 100
  const light = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sat * Math.min(light, 1 - light)
  const f = (n: number) => Math.round(255 * (light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))
  return [f(0), f(8), f(4)]
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const inGrid = (col: number, row: number) => col >= 0 && row >= 0 && col < GRID_COLS && row < GRID_ROWS
/** 外周の 1 マス (縁)。主人公の通り道で、ことばは入れない (押し込まれたことばは、ここで消える) */
const isRing = (col: number, row: number) => col === 0 || row === 0 || col === GRID_COLS - 1 || row === GRID_ROWS - 1
const inPot = (col: number, row: number) =>
  col >= POT_COL && col < POT_COL + POT_SIZE && row >= POT_ROW && row < POT_ROW + POT_SIZE
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export class WordAlchemyStage implements EffectHost {
  private readonly engine: Engine
  private readonly heroActor: Actor
  private readonly audio = new WordAlchemyAudio()
  private readonly popups: { actor: Actor; options: PopupOptions; age: number; baseY: number }[] = []
  private lastSteamAt = 0
  private readonly words: Word[] = []
  private readonly held: string[] = []
  private readonly hero = { col: HERO_START.col, row: HERO_START.row, cooldown: 0 }
  private readonly pot = {
    ingredients: [] as BrewMaterial[],
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
  private probe: CanvasRenderingContext2D | null = null
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
    board.graphics.use(
      new Canvas({ width: BOARD_W, height: BOARD_H, cache: true, draw: (ctx) => drawBoard(ctx, BOARD_W, BOARD_H) })
    )
    this.engine.add(board)

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
        draw: (ctx) => drawPot(ctx, this.pot.ingredients.length, this.pot.brewing, this.clock),
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

  /** コメントを「ことば」にして、空いているマスに降らせる (ゲーム中だけ) */
  spawn(request: WordSpawnRequest): void {
    if (!this.running) return
    let added = false
    for (const text of splitWords(request.comment)) {
      const cell = this.randomFreeCell()
      if (!cell) break
      this.addWord(request.userId, request.userName, text, cell)
      added = true
    }
    if (added) playSpawn(this)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    window.removeEventListener('keydown', this.onKeydown)
    window.removeEventListener('keyup', this.onKeyup)
    window.removeEventListener('blur', this.clearKeys)
    this.engine.stop()
    this.engine.dispose()
    this.popups.length = 0
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
    const probe = (this.probe ??= document.createElement('canvas').getContext('2d')!)
    const font = `bold ${o.size}px sans-serif`
    probe.font = font
    const width = Math.ceil(probe.measureText(o.text).width) + 24
    const height = o.size + 18
    const x = clamp(o.x, width / 2, Math.max(width / 2, BOARD_W - width / 2))
    const y = clamp(o.y, height / 2, BOARD_H)
    const actor = new Actor({ pos: vec(x, y), width, height, z: 1600 })
    actor.graphics.use(
      new Canvas({
        width,
        height,
        cache: true,
        draw: (ctx) => {
          ctx.font = font
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.lineJoin = 'round'
          ctx.lineWidth = Math.max(4, o.size / 6)
          ctx.strokeStyle = 'rgba(20,20,30,0.85)'
          ctx.strokeText(o.text, width / 2, height / 2)
          ctx.fillStyle = o.color
          ctx.fillText(o.text, width / 2, height / 2)
        },
      })
    )
    this.engine.add(actor)
    this.popups.push({ actor, options: o, age: 0, baseY: y })
    while (this.popups.length > POPUP_MAX) this.popups.shift()!.actor.kill()
  }

  /** 浮かぶ文字を進める: 出たら少し弾んで、上へ浮かびながら、最後に薄くなって消える */
  private syncPopups(dt: number): void {
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i]
      p.age += dt * 1000
      const t = p.age / p.options.lifeMs
      if (t >= 1) {
        p.actor.kill()
        this.popups.splice(i, 1)
        continue
      }
      const eased = 1 - (1 - t) * (1 - t)
      const pop = 1 + 0.35 * Math.max(0, 1 - t * 8)
      p.actor.pos = vec(p.actor.pos.x, p.baseY - p.options.rise * eased)
      p.actor.scale = vec(pop, pop)
      p.actor.graphics.opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3
    }
  }

  // ---- キー入力 (WASD) ----

  private readonly onKeydown = (event: KeyboardEvent) => {
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
    Object.assign(this.pot, { ingredients: [], brewing: false, endsAt: 0, result: undefined, reserved: 0 })
    for (const p of this.popups) p.actor.kill()
    this.popups.length = 0
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
    this.syncPopups(dt)
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
    chain.forEach((w, i) => this.moveWord(w, w.col + dx, w.row + dy, i * PUSH_WAVE_DELAY_SECONDS))
    const last = chain[chain.length - 1]
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

  /** from があれば、そのマスから動いてくる (投げ飛ばし)。なければ、盤面の上から落ちてくる */
  private addWord(
    userId: string,
    userName: string,
    text: string,
    cell: { col: number; row: number },
    from?: { col: number; row: number }
  ): void {
    // 上限を超えるときは、古いものから消す
    while (this.words.filter((w) => !w.exit).length >= WORD_MAX) {
      const oldest = this.words.find((w) => !w.exit)
      if (!oldest) break
      this.removeWord(oldest)
    }
    const actor = new Actor({ pos: vec(-1000, -1000), width: CELL_PX, height: CELL_PX, z: 50 })
    actor.graphics.use(new Canvas({ width: CELL_PX, height: CELL_PX, cache: true, draw: (ctx) => drawWord(ctx, text) }))
    this.engine.add(actor)
    this.words.push({
      userId,
      userName,
      text,
      col: cell.col,
      row: cell.row,
      prevCol: from?.col ?? cell.col,
      prevRow: from?.row ?? cell.row,
      movedAt: this.clock,
      fallStartedAt: from ? null : this.clock,
      exit: null,
      rejected: false,
      actor,
    })
  }

  private removeWord(w: Word): void {
    w.actor.kill()
    this.words.splice(this.words.indexOf(w), 1)
  }

  /**
   * 動き終わった (縁へ出た・鍋に入った) ことばを片付ける。
   * 鍋が受け付けなかったものは、空いているマスへ投げ飛ばす (なければ消える)。受け付けたものは、ここで材料になる
   */
  private finishExit(w: Word): void {
    this.removeWord(w)
    if (w.exit === 'out') {
      playWordGone(this, cellCenter(w.col, w.row))
    } else if (w.rejected) {
      playReject(this, POT_CENTER)
      const cell = this.randomFreeCell()
      if (cell) this.addWord(w.userId, w.userName, w.text, cell, { col: w.col, row: w.row })
    } else {
      this.pot.reserved--
      this.pot.ingredients.push({ text: w.text, userId: w.userId, userName: w.userName })
      playIntake(this, { top: POT_TOP, center: POT_CENTER }, this.pot.ingredients.length)
      if (this.pot.ingredients.length >= POT_INGREDIENTS) this.startBrew()
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

  /** 鍋に押し込まれたことば。煮込み中・受け付けないことばは、材料にならず、あとで投げ飛ばす */
  private intake(w: Word): void {
    w.exit = 'pot'
    // 煮込み中・材料が揃う予定のとき (動いている途中のものを含む) は、受け付けない
    const full = this.pot.brewing || this.pot.ingredients.length + this.pot.reserved >= POT_INGREDIENTS
    w.rejected = full || !(this.options.accepts?.(w.text) ?? true)
    if (!w.rejected) this.pot.reserved++
  }

  private startBrew(): void {
    const ingredients = this.pot.ingredients.splice(0)
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
    this.showResult(pot.result, POT_TOP.x, POT_TOP.y)
  }

  /** 鍋の上に、結果のカード (名前と、新種・既発見の表示) を出して、しばらくして消す */
  private showResult(outcome: BrewOutcome, x: number, y: number): void {
    const probe = (this.probe ??= document.createElement('canvas').getContext('2d')!)
    const titleFont = 'bold 28px sans-serif'
    const subFont = 'bold 16px sans-serif'
    probe.font = titleFont
    const titleWidth = probe.measureText(outcome.title).width
    probe.font = subFont
    const subWidth = outcome.subtitle ? probe.measureText(outcome.subtitle).width : 0
    const width = Math.min(BOARD_W, Math.ceil(Math.max(titleWidth, subWidth)) + 32)
    const height = outcome.subtitle ? 76 : 48
    const accent = RESULT_ACCENT[outcome.kind]
    const actor = new Actor({
      pos: vec(clamp(x, width / 2, BOARD_W - width / 2), y - (height - 48) / 2),
      width,
      height,
      z: 1700,
    })
    actor.graphics.use(
      new Canvas({
        width,
        height,
        cache: true,
        draw: (ctx) => {
          ctx.fillStyle = 'rgba(20,20,30,0.88)'
          ctx.strokeStyle = accent
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.roundRect(2, 2, width - 4, height - 4, 14)
          ctx.fill()
          ctx.stroke()
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = '#ffffff'
          ctx.font = titleFont
          ctx.fillText(outcome.title, width / 2, outcome.subtitle ? 28 : height / 2, width - 24)
          if (outcome.subtitle) {
            ctx.fillStyle = accent
            ctx.font = subFont
            ctx.fillText(outcome.subtitle, width / 2, height - 20, width - 24)
          }
        },
      })
    )
    this.engine.add(actor)
    actor.actions
      .delay(RESULT_SHOW_SECONDS * 1000)
      .fade(0, 700)
      .die()
  }
}
