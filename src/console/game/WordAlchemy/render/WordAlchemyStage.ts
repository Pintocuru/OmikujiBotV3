// src/console/game/WordAlchemy/render/WordAlchemyStage.ts
// 盤面。Excalibur のアクターがそのままゲームの状態になる (進行・描画・演出を、ここ 1 か所で持つ)。
// 外とのやりとりは、start / stop / spawn と、材料から名前を作る brew (非同期) だけ。
// 非表示の間は rAF が止まり、再表示の最初のフレームも Excalibur が丸める (200ms 超は 1ms) ので、ゲームも止まる
import { Actor, Canvas, Color, DisplayMode, Engine, vec } from 'excalibur'
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

export type WordSpawnRequest = { userId: string; userName: string; comment: string }
/** 材料から完成品の名前を作る (非同期。失敗したら、材料をつなげた名前になる) */
export type BrewHandler = (ingredients: string[]) => Promise<string>
export type StageOptions = {
  brew: BrewHandler
  /** 鍋が受け付けることばか (受け付けなければ、鍋が投げ飛ばす)。既定は何でも受け付ける */
  accepts?: (text: string) => boolean
}

const BOARD_W = GRID_COLS * CELL_PX
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

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const inGrid = (col: number, row: number) => col >= 0 && row >= 0 && col < GRID_COLS && row < GRID_ROWS
/** 外周の 1 マス (縁)。主人公の通り道で、ことばは入れない (押し込まれたことばは、ここで消える) */
const isRing = (col: number, row: number) => col === 0 || row === 0 || col === GRID_COLS - 1 || row === GRID_ROWS - 1
const inPot = (col: number, row: number) =>
  col >= POT_COL && col < POT_COL + POT_SIZE && row >= POT_ROW && row < POT_ROW + POT_SIZE
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export class WordAlchemyStage {
  private readonly engine: Engine
  private readonly heroActor: Actor
  private readonly words: Word[] = []
  private readonly held: string[] = []
  private readonly hero = { col: HERO_START.col, row: HERO_START.row, cooldown: 0 }
  private readonly pot = {
    ingredients: [] as string[],
    brewing: false,
    endsAt: 0,
    result: undefined as string | undefined,
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
    for (const text of splitWords(request.comment)) {
      const cell = this.randomFreeCell()
      if (!cell) return
      this.addWord(request.userId, request.userName, text, cell)
    }
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    window.removeEventListener('keydown', this.onKeydown)
    window.removeEventListener('keyup', this.onKeyup)
    window.removeEventListener('blur', this.clearKeys)
    this.engine.stop()
    this.engine.dispose()
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
    Object.assign(this.pot, { ingredients: [], brewing: false, endsAt: 0, result: undefined })
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

  /** 動き終わった (外へ出た・鍋に入った) ことばを片付ける。鍋が受け付けなかったものは、空いているマスへ投げ飛ばす (なければ消える) */
  private finishExit(w: Word): void {
    this.removeWord(w)
    if (!w.rejected) return
    const cell = this.randomFreeCell()
    if (cell) this.addWord(w.userId, w.userName, w.text, cell, { col: w.col, row: w.row })
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
        if (fallT >= 1) w.fallStartedAt = null
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
    w.rejected = this.pot.brewing || !(this.options.accepts?.(w.text) ?? true)
    if (w.rejected) return
    this.pot.ingredients.push(w.text)
    if (this.pot.ingredients.length >= POT_INGREDIENTS) this.startBrew()
  }

  private startBrew(): void {
    const ingredients = this.pot.ingredients.splice(0)
    const run = this.runId
    Object.assign(this.pot, { brewing: true, endsAt: this.clock + BREW_SECONDS, result: undefined })
    this.options
      .brew(ingredients)
      .catch(() => ingredients.join(''))
      .then((result) => {
        if (run === this.runId) this.pot.result = result
      })
  }

  /** 結果が届いていて、最短の時間も過ぎたら、完成 */
  private stepPot(): void {
    const pot = this.pot
    if (!pot.brewing || pot.result === undefined || this.clock < pot.endsAt) return
    pot.brewing = false
    this.showText(pot.result, (POT_COL + POT_SIZE / 2) * CELL_PX, POT_ROW * CELL_PX - 4)
  }

  /** 鍋の上に、完成した名前を出して、しばらくして消す */
  private showText(text: string, x: number, y: number): void {
    const font = 'bold 28px sans-serif'
    const probe = (this.probe ??= document.createElement('canvas').getContext('2d')!)
    probe.font = font
    const width = Math.min(BOARD_W, Math.ceil(probe.measureText(text).width) + 32)
    const height = 48
    const actor = new Actor({ pos: vec(clamp(x, width / 2, BOARD_W - width / 2), y), width, height, z: 1700 })
    actor.graphics.use(
      new Canvas({
        width,
        height,
        cache: true,
        draw: (ctx) => {
          ctx.fillStyle = 'rgba(20,20,30,0.85)'
          ctx.beginPath()
          ctx.roundRect(2, 2, width - 4, height - 4, 14)
          ctx.fill()
          ctx.fillStyle = '#ffe9a8'
          ctx.font = font
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(text, width / 2, height / 2, width - 24)
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
