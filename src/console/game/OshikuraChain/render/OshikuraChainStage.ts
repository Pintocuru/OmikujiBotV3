// src/console/game/OshikuraChain/render/OshikuraChainStage.ts
// Excalibur による盤面の描画・演出。ゲームの状態 (GameState) を毎フレーム読み取って映すだけで、ゲームには何も返さない。
// 進行 (nuisanceEngine) からは呼ばれない。受け取るのは source (読み取り専用の窓口) だけ
import { Actor, Canvas, Color, DisplayMode, Engine, EmitterType, ParticleEmitter, vec, type Scene } from 'excalibur'
import { CELL_PX, HERO_MOVE_INTERVAL_SECONDS } from '../scripts/nuisanceConstants'
import type { OshikuraChainConfig } from '../scripts/nuisanceConfig'
import {
  footprintOf,
  sizeScaleOf,
  type GameState,
  type GridSize,
  type ParticipantIcon,
  type OshikuraChainEvent,
  type Word,
} from '../scripts/nuisanceEngine'
import { formatGiftPrice, giftColorOf } from '../scripts/nuisanceGift'
import {
  FALL_EXTRA_CELLS,
  FALL_SECONDS,
  playChainBreak,
  playMultiplierReset,
  playMultiplierUp,
  playDeath,
  playGameOver,
  playLand,
  playScore,
  playWordBlast,
  playWordGone,
  type BurstOptions,
  type EffectHost,
  type PopupOptions,
} from './effectPresets'
import { OshikuraChainAudio } from './OshikuraChainAudio'
import { StarField } from './StarField'
import { BOARD_BACKGROUND, drawBoard } from './draw/board'
import { drawHero } from './draw/hero'
import { ImageCache } from './draw/imageCache'
import { drawParticipantIcon, VIEW_PX } from './draw/nuisance'
import { clamp, hslToRgb, lerp } from './draw/util'
import { drawWord } from './draw/word'
import type { SoundKey } from './stageSounds'

/** 盤面が読み取るゲームの窓口 (読み取り専用。ゲームを操作するものは入れない) */
export type OshikuraChainStageSource = {
  getState: () => GameState | null
  getConfig: () => OshikuraChainConfig | null
  /** 描画用の時計 (開始からの秒) */
  getClock: () => number
  /** 溜まった演出用イベントを受け取って、空にする */
  drainEvents: () => OshikuraChainEvent[]
}

const MOVE_ANIM_SECONDS = 0.15
/** 同時に出せる浮かぶ文字の数の上限 (連鎖が一気に続いても、画面が文字だらけにならないように) */
const POPUP_MAX = 40
/** 邪魔者 1 体ぶんの表示 */
type ParticipantIconView = {
  actor: Actor
  nuisance: ParticipantIcon
  /** 落下の開始時刻 (描画用の時計の秒)。null なら落下は終わっている */
  fallStartedAt: number | null
  isBoss: boolean
}

/** 「ことば」1 つぶんの表示 */
type WordView = {
  actor: Actor
  word: Word
  /** 落下の開始時刻 (描画用の時計の秒)。null なら落下は終わっている */
  fallStartedAt: number | null
  /** 消えるまでの残りの割合 (1 → 0)。円グラフで見せる */
  leftRatio: number
}

/** 浮かぶ文字 1 つぶんの表示 (連鎖・得点・初見の知らせ。見た目だけで、ゲームには影響しない) */
type PopupView = { actor: Actor; options: PopupOptions; age: number; baseY: number }

/** 盤面の外へ押し出されていく途中の表示 (ウェーブに合わせて、少し遅れて動き出し、外へ滑って消える) */
type Ghost = {
  actor: Actor
  x: number
  y: number
  dx: number
  dy: number
  startAt: number
  onEnd?: () => void
}

export class OshikuraChainStage implements EffectHost {
  private readonly engine: Engine
  private readonly views = new Map<number, ParticipantIconView>()
  private readonly images = new ImageCache()
  private readonly audio: OshikuraChainAudio
  private readonly heroActor: Actor
  private readonly starField: StarField
  private readonly wordViews = new Map<number, WordView>()
  private readonly ghosts: Ghost[] = []
  private readonly popups: PopupView[] = []
  private readonly grid: GridSize
  private heroX = NaN
  private heroY = NaN
  private disposed = false

  constructor(
    canvas: HTMLCanvasElement,
    grid: GridSize,
    private readonly source: OshikuraChainStageSource
  ) {
    this.grid = grid
    this.audio = new OshikuraChainAudio()
    const width = grid.cols * CELL_PX
    const height = grid.rows * CELL_PX
    this.engine = new Engine({
      canvasElement: canvas,
      width,
      height,
      displayMode: DisplayMode.FitContainerAndFill,
      backgroundColor: Color.fromHex(BOARD_BACKGROUND),
      suppressPlayButton: true,
    })

    const board = new Actor({ pos: vec(width / 2, height / 2), width, height, z: 0 })
    board.graphics.use(new Canvas({ width, height, cache: true, draw: (ctx) => drawBoard(ctx, this.grid, width, height) }))
    this.engine.add(board)

    // 背景の星: 盤面の上、アクターの下。毎フレーム描き直す (速さは sync で連鎖数から決める)
    this.starField = new StarField(width, height)
    const stars = new Actor({ pos: vec(width / 2, height / 2), width, height, z: 1 })
    stars.graphics.use(new Canvas({ width, height, cache: false, draw: (ctx) => this.starField.draw(ctx) }))
    this.engine.add(stars)

    this.heroActor = new Actor({ pos: vec(-1000, -1000), width: CELL_PX, height: CELL_PX, z: 1000 })
    this.heroActor.graphics.use(
      new Canvas({ width: CELL_PX, height: CELL_PX, cache: false, draw: (ctx) => drawHero(ctx) })
    )
    this.heroActor.graphics.isVisible = false
    this.engine.add(this.heroActor)

    this.engine.currentScene.on('preupdate', (event) => this.sync(event.elapsed / 1000))
    void this.engine.start()
  }

  /** 画面を片付ける (Vue の onBeforeUnmount から呼ぶ) */
  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.engine.stop()
    this.engine.dispose()
    this.views.clear()
    this.wordViews.clear()
    this.ghosts.length = 0
    this.popups.length = 0
    this.audio.dispose()
  }

  // ---- EffectHost (演出の実体) ----

  play(key: SoundKey): void {
    this.audio.play(key)
  }

  get boardSize(): { width: number; height: number } {
    return { width: this.grid.cols * CELL_PX, height: this.grid.rows * CELL_PX }
  }

  /** 音階の音は OshikuraChainAudio に委譲する */
  playNote(frequency: number, delaySeconds: number): void {
    this.audio.playNote(frequency, delaySeconds)
  }

  popup(o: PopupOptions): void {
    const probe = (this.measureCtx ??= document.createElement('canvas').getContext('2d')!)
    const font = `bold ${o.size}px sans-serif`
    probe.font = font
    const width = Math.ceil(probe.measureText(o.text).width) + 24
    const height = o.size + 18
    const board = this.boardSize
    const x = clamp(o.x, width / 2, Math.max(width / 2, board.width - width / 2))
    const y = clamp(o.y, height / 2, board.height)
    const actor = new Actor({ pos: vec(x, y), width, height, z: 1700 })
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
    actor.graphics.isVisible = false
    this.engine.add(actor)
    this.popups.push({ actor, options: o, age: 0, baseY: y })
    while (this.popups.length > POPUP_MAX) this.popups.shift()!.actor.kill()
  }

  /** 浮かぶ文字を進める。待ち時間のあいだは見えず、出たら少し弾んで、上へ浮かびながら、最後に薄くなる */
  private syncPopups(dt: number): void {
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i]
      p.age += dt * 1000
      const t = (p.age - p.options.delayMs) / p.options.lifeMs
      if (t >= 1) {
        p.actor.kill()
        this.popups.splice(i, 1)
        continue
      }
      if (t < 0) continue
      const eased = 1 - (1 - t) * (1 - t)
      const pop = 1 + 0.35 * Math.max(0, 1 - t * 8)
      p.actor.graphics.isVisible = true
      p.actor.pos = vec(p.actor.pos.x, p.baseY - p.options.rise * eased)
      p.actor.scale = vec(pop, pop)
      p.actor.graphics.opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3
    }
  }

  private clearPopups(): void {
    for (const p of this.popups) p.actor.kill()
    this.popups.length = 0
  }

  shake(magnitude: number, durationMs: number): void {
    this.engine.currentScene.camera.shake(magnitude, magnitude, durationMs)
  }

  burst(o: BurstOptions): void {
    const scene: Scene = this.engine.currentScene
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
        minAngle: 0,
        maxAngle: Math.PI * 2,
        minSize: o.minSize,
        maxSize: o.maxSize,
        beginColor: Color.fromRGB(...hslToRgb(o.hue, o.saturation, o.lightness)),
        endColor: Color.fromRGB(...hslToRgb(o.hue, o.saturation, Math.max(10, o.lightness - 25))),
      },
    })
    scene.add(emitter)
    emitter.emitParticles(o.count)
    // 粒が消えたあと、エミッターごと片付ける
    emitter.actions.delay(o.lifeMs + 200).die()
  }

  // ---- 毎フレームの同期 ----

  private sync(dt: number): void {
    if (this.disposed) return
    const events = this.source.drainEvents()
    const state = this.source.getState()
    const config = this.source.getConfig()
    const clock = this.source.getClock()
    // 背景の星は、ゲーム前・メニュー中も、ゆっくり流す (連鎖が増えるほど速くなる)
    this.starField.update(dt, state && config ? state.chain : 0)

    if (!state || !config) {
      // ゲーム前・メニュー中: 盤面を空にする
      this.clearViews()
      this.clearWords()
      this.clearGhosts()
      this.clearPopups()
      this.heroActor.graphics.isVisible = false
      this.heroX = NaN
      return
    }

    this.applyEvents(events, state, clock)
    this.syncParticipantIcons(state, clock)
    this.syncHero(state, dt)
    this.syncWords(state, clock)
    this.syncGhosts(clock)
    this.syncPopups(dt)
  }

  // ---- 押し出されて消えるもの (ウェーブ) ----

  /** 盤面の外へ押し出されるものを、delaySeconds 後に 1 マス外へ滑らせて消す (終わったら onEnd) */
  private slideOut(
    actor: Actor,
    x: number,
    y: number,
    push: { pushDx: number; pushDy: number; delaySeconds: number },
    clock: number,
    onEnd?: () => void
  ): void {
    this.ghosts.push({ actor, x, y, dx: push.pushDx, dy: push.pushDy, startAt: clock + push.delaySeconds, onEnd })
  }

  private syncGhosts(clock: number): void {
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i]
      const t = clamp((clock - g.startAt) / MOVE_ANIM_SECONDS, 0, 1)
      const eased = 1 - (1 - t) * (1 - t)
      g.actor.pos = vec(g.x + g.dx * CELL_PX * eased, g.y + g.dy * CELL_PX * eased)
      if (t < 1) continue
      g.actor.kill()
      this.ghosts.splice(i, 1)
      g.onEnd?.()
    }
  }

  private clearGhosts(): void {
    for (const g of this.ghosts) g.actor.kill()
    this.ghosts.length = 0
  }

  // ---- ことば (コメントの文字。ダメージなし・押し出せる・時間で消える) ----

  private createWordView(word: Word): WordView {
    const size = CELL_PX - 6
    const actor = new Actor({ pos: vec(-1000, -1000), width: CELL_PX, height: CELL_PX, z: 50 })
    const view: WordView = { actor, word, fallStartedAt: null, leftRatio: 1 }
    // 円グラフ (消えるまでの時間) が毎フレーム変わるので、キャッシュしない (ことばは最大 30 個で、軽い)
    actor.graphics.use(
      new Canvas({ width: CELL_PX, height: CELL_PX, cache: false, draw: (ctx) => drawWord(ctx, view.word, view.leftRatio, size) })
    )
    this.engine.add(actor)
    this.wordViews.set(word.id, view)
    return view
  }

  private clearWords(): void {
    for (const v of this.wordViews.values()) v.actor.kill()
    this.wordViews.clear()
  }

  /** 状態のことばに合わせて、表示を足す・消す。消える直前の 2 秒は点滅する */
  private syncWords(state: GameState, clock: number): void {
    const alive = new Set<number>()
    for (const w of state.words) {
      alive.add(w.id)
      // イベントを取り逃したものは、落下なしで表示する
      const view = this.wordViews.get(w.id) ?? this.createWordView(w)
      view.word = w
      const t = clamp((clock - w.movedAt) / MOVE_ANIM_SECONDS, 0, 1)
      const eased = 1 - (1 - t) * (1 - t)
      const x = (lerp(w.prevCol, w.col, eased) + 0.5) * CELL_PX
      let y = (lerp(w.prevRow, w.row, eased) + 0.5) * CELL_PX
      let opacity = 1
      if (view.fallStartedAt !== null) {
        const fallT = clamp((clock - view.fallStartedAt) / FALL_SECONDS, 0, 1)
        y -= (w.row + 1 + FALL_EXTRA_CELLS) * CELL_PX * (1 - fallT * fallT)
        opacity = clamp(fallT * 4, 0, 1)
        if (fallT >= 1) view.fallStartedAt = null
      }
      const left = w.expiresAt - state.elapsed
      view.leftRatio = w.protected ? 1 : clamp(left / w.lifeSeconds, 0, 1)
      if (!w.protected && left < 2) opacity *= 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(clock * 16))
      view.actor.pos = vec(x, y)
      view.actor.graphics.opacity = opacity
    }
    // 消えたもの (時間切れ。押し出されたものは、ウェーブに合わせて別に消す)
    for (const [id, view] of this.wordViews) {
      if (alive.has(id)) continue
      view.actor.kill()
      this.wordViews.delete(id)
    }
  }

  // ---- ギフト通知 ----

  /** ギフト受信時に、名前・金額・保護効果を盤面の上のほうに出す */
  private showGiftNotice(userName: string, price: number, protectSeconds: number, coolAmount: number): void {
    const color = giftColorOf(price)
    const coolText = coolAmount > 0 ? ` 冷却 -×${coolAmount.toFixed(1)}` : ''
    const protectText = protectSeconds > 0 ? ` ワード保護 ${protectSeconds}秒` : ''
    const label = `${userName} ${formatGiftPrice(price)}！${protectText}${coolText}`
    const width = Math.min(this.grid.cols * CELL_PX, Math.max(180, label.length * 20 + 32))
    const height = 48
    const actor = new Actor({
      pos: vec((this.grid.cols * CELL_PX) / 2, 36 + Math.random() * 40),
      width,
      height,
      z: 1600,
    })
    actor.graphics.use(
      new Canvas({
        width,
        height,
        cache: true,
        draw: (ctx) => {
          ctx.fillStyle = color.background
          ctx.beginPath()
          ctx.roundRect(2, 2, width - 4, height - 4, 14)
          ctx.fill()
          ctx.fillStyle = color.text
          ctx.font = 'bold 20px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, width / 2, height / 2)
        },
      })
    )
    this.engine.add(actor)
    actor.actions.delay(2500).fade(0, 700).die()
  }

  private measureCtx: CanvasRenderingContext2D | null = null

  private applyEvents(events: OshikuraChainEvent[], state: GameState, clock: number): void {
    for (const event of events) {
      if (event.type === 'iconSpawn') {
        const nuisance = state.icons.find((n) => n.id === event.id)
        // すでに消えている (出現と同じ更新で撃破された) ものは、落下を見せない
        if (!nuisance) continue
        const view = this.createView(nuisance, event.isBoss)
        view.fallStartedAt = clock
      } else if (event.type === 'gameOver') {
        playGameOver(this, event)
      } else if (event.type === 'giftReceived') {
        this.play('gift')
        this.showGiftNotice(event.userName, event.price, event.protectSeconds, event.coolAmount)
      } else if (event.type === 'wordSpawn') {
        const word = state.words.find((w) => w.id === event.id)
        if (!word) continue
        this.createWordView(word).fallStartedAt = clock
      } else if (event.type === 'wordGone') {
        const view = this.wordViews.get(event.id)
        if (!view) continue
        this.wordViews.delete(event.id)
        const at = { x: (event.col + 0.5) * CELL_PX, y: (event.row + 0.5) * CELL_PX, size: CELL_PX }
        // 連鎖のウェーブが届いたら外へ滑って、白い破片になる
        this.slideOut(view.actor, at.x, at.y, event, clock, () => playWordGone(this, at))
      } else if (event.type === 'wordExplode') {
        // 巻き込まれたことばは、その場で白い破片になって消える (表示は、ここで外す)
        const victims = event.victims.flatMap((id) => {
          const view = this.wordViews.get(id)
          if (!view) return []
          this.wordViews.delete(id)
          view.actor.kill()
          return [{ x: view.actor.pos.x, y: view.actor.pos.y, size: CELL_PX }]
        })
        const view = this.wordViews.get(event.id)
        const at = view
          ? { x: view.actor.pos.x, y: view.actor.pos.y, size: CELL_PX }
          : { x: (event.col + 0.5) * CELL_PX, y: (event.row + 0.5) * CELL_PX, size: CELL_PX }
        playWordBlast(this, at, victims)
      } else if (event.type === 'score') {
        playScore(this, event, { x: (event.col + 0.5) * CELL_PX, y: (event.row + 0.5) * CELL_PX })
      } else if (event.type === 'chainBreak') {
        playChainBreak(this, event)
      } else if (event.type === 'multiplierUp') {
        playMultiplierUp(this, event)
      } else if (event.type === 'multiplierReset') {
        playMultiplierReset(this, event)
      } else if (event.type === 'iconRemoved') {
        const size = event.footprint * CELL_PX
        const at = {
          x: (event.col + event.footprint / 2) * CELL_PX,
          y: (event.row + event.footprint / 2) * CELL_PX,
          size,
        }
        const view = this.views.get(event.id)
        if (view && event.delaySeconds && event.pushDx !== undefined && event.pushDy !== undefined) {
          // 連鎖の途中で押し出されたもの: ウェーブが届くまで盤面に残し、外へ滑らせてから消す
          this.views.delete(event.id)
          this.slideOut(
            view.actor,
            at.x,
            at.y,
            { pushDx: event.pushDx, pushDy: event.pushDy, delaySeconds: event.delaySeconds },
            clock,
            () => playDeath(this, event, at)
          )
        } else {
          playDeath(this, event, at)
        }
      }
    }
  }

  private createView(nuisance: ParticipantIcon, isBoss: boolean): ParticipantIconView {
    const actor = new Actor({ pos: vec(-1000, -1000), width: VIEW_PX, height: VIEW_PX })
    const view: ParticipantIconView = { actor, nuisance, fallStartedAt: null, isBoss }
    actor.graphics.use(
      new Canvas({
        width: VIEW_PX,
        height: VIEW_PX,
        cache: false,
        draw: (ctx) => drawParticipantIcon(ctx, view.nuisance, this.images.get(view.nuisance.profileImage)),
      })
    )
    this.engine.add(actor)
    this.views.set(nuisance.id, view)
    return view
  }

  private clearViews(): void {
    for (const view of this.views.values()) view.actor.kill()
    this.views.clear()
  }

  private syncParticipantIcons(state: GameState, clock: number): void {
    const alive = new Set<number>()
    for (const n of state.icons) {
      alive.add(n.id)
      // イベントを取り逃した (表示を切り替えた直後など) ものは、落下なしで表示する
      const view = this.views.get(n.id) ?? this.createView(n, false)
      view.nuisance = n

      const scale = sizeScaleOf(n)
      const footprint = footprintOf(scale)
      const t = clamp((clock - n.movedAt) / MOVE_ANIM_SECONDS, 0, 1)
      const eased = 1 - (1 - t) * (1 - t)
      const x = (lerp(n.prevCol, n.col, eased) + footprint / 2) * CELL_PX
      let y = (lerp(n.prevRow, n.row, eased) + footprint / 2) * CELL_PX

      // 落下: 盤面の上から、加速しながら落ちる。着地した瞬間に、土煙と揺れを出す
      let opacity = 1
      if (view.fallStartedAt !== null) {
        const fallT = clamp((clock - view.fallStartedAt) / FALL_SECONDS, 0, 1)
        const height = (n.row + footprint + FALL_EXTRA_CELLS) * CELL_PX
        y -= height * (1 - fallT * fallT)
        opacity = clamp(fallT * 4, 0, 1)
        if (fallT >= 1) {
          view.fallStartedAt = null
          playLand(this, { x, y, size: footprint * CELL_PX, isBoss: view.isBoss })
        }
      }

      view.actor.pos = vec(x, y)
      view.actor.graphics.opacity = opacity
      // 大きいものを後ろに、小さいものを前に (小さいものが隠れないように)
      view.actor.z = 100 - Math.round(scale * 10)
    }
    // 消えたもの (撃破の演出は、イベントで出す)
    for (const [id, view] of this.views) {
      if (alive.has(id)) continue
      view.actor.kill()
      this.views.delete(id)
    }
  }

  private syncHero(state: GameState, dt: number): void {
    const targetX = (state.hero.col + 0.5) * CELL_PX
    const targetY = (state.hero.row + 0.5) * CELL_PX
    if (Number.isNaN(this.heroX)) {
      this.heroX = targetX
      this.heroY = targetY
    }
    const follow = Math.min(1, dt / (HERO_MOVE_INTERVAL_SECONDS * 0.6))
    this.heroX += (targetX - this.heroX) * follow
    this.heroY += (targetY - this.heroY) * follow
    this.heroActor.pos = vec(this.heroX, this.heroY)
    this.heroActor.graphics.isVisible = true
  }
}
