// src/console/game/NuisanceSurvival/render/NuisanceStage.ts
// Excalibur による盤面の描画・演出。ゲームの状態 (GameState) を毎フレーム読み取って映すだけで、ゲームには何も返さない。
// 進行 (nuisanceEngine) からは呼ばれない。受け取るのは source (読み取り専用の窓口) だけ
import {
  Actor,
  Canvas,
  Color,
  DisplayMode,
  Engine,
  EmitterType,
  ParticleEmitter,
  Sound,
  vec,
  type Scene,
} from 'excalibur'
import { getSoundPath } from '@/common/AppEnv'
import { resolveAsset } from '@/common/sounds'
import {
  BUBBLE_ALPHA,
  BUBBLE_FADE_SECONDS,
  BUBBLE_MAX,
  BUBBLE_SECONDS,
  CELL_PX,
  HERO_MOVE_INTERVAL_SECONDS,
  MAX_FOOTPRINT,
} from '../scripts/nuisanceConstants'
import { bubbleLabel, pickBubbleCenter, type CommentBubble } from '../scripts/nuisanceBubble'
import type { NuisanceConfigType } from '../scripts/nuisanceConfig'
import {
  footprintOf,
  sizeScaleOf,
  type GameState,
  type GridSize,
  type Nuisance,
  type NuisanceEvent,
  type Obstacle,
} from '../scripts/nuisanceEngine'
import { formatObstaclePrice, obstacleColorOf } from '../scripts/nuisanceObstacle'
import type { NuisanceKind } from '../scripts/nuisanceTraits'
import { FALL_EXTRA_CELLS, FALL_SECONDS, playDeath, playLand, type BurstOptions, type EffectHost } from './effectPresets'
import { MAX_CONCURRENT_PER_SOUND, SOUND_FILES, SOUND_FOLDER, type SoundKey } from './stageSounds'

/** 盤面が読み取るゲームの窓口 (読み取り専用。ゲームを操作するものは入れない) */
export type StageSource = {
  getState: () => GameState | null
  getConfig: () => NuisanceConfigType | null
  /** 描画用の時計 (開始からの秒) */
  getClock: () => number
  /** 溜まった演出用イベントを受け取って、空にする */
  drainEvents: () => NuisanceEvent[]
  /** 溜まった吹き出しの依頼を受け取って、空にする */
  drainBubbles: () => CommentBubble[]
}

const MOVE_ANIM_SECONDS = 0.15
const FLASH_SECONDS = 0.25
/** 邪魔者 1 体を描く canvas の一辺。最大の大きさ + 赤い輪・緑の輪の分の余白 */
const VIEW_PX = CELL_PX * MAX_FOOTPRINT + 32
const KIND_GLYPH: Record<NuisanceKind, string> = {
  static: '',
  wanderer: '👣',
  evader: '💨',
  creeper: '💕',
  bouncer: '⇄',
  bomber: '💣',
  boss: '👑',
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** 邪魔者 1 体ぶんの表示 */
type NuisanceView = {
  actor: Actor
  nuisance: Nuisance
  /** 落下の開始時刻 (描画用の時計の秒)。null なら落下は終わっている */
  fallStartedAt: number | null
  isBoss: boolean
}

/** 吹き出し 1 つぶんの表示 (視界妨害。見た目だけで、ゲームには影響しない) */
type BubbleView = { actor: Actor; remaining: number }

export class NuisanceStage implements EffectHost {
  private readonly engine: Engine
  private readonly views = new Map<number, NuisanceView>()
  private readonly images = new Map<string, HTMLImageElement | null>()
  /** 読み込めた効果音 (素材がないものは null。一度だけ試して、再試行しない) */
  private readonly sounds = new Map<SoundKey, Sound | null>()
  private readonly heroActor: Actor
  private readonly bubbles: BubbleView[] = []
  private readonly obstacleViews = new Map<number, { actor: Actor; obstacle: Obstacle }>()
  private readonly grid: GridSize
  private heroX = NaN
  private heroY = NaN
  private lastLife = Infinity
  private flashRemaining = 0
  private disposed = false

  constructor(
    canvas: HTMLCanvasElement,
    grid: GridSize,
    private readonly source: StageSource
  ) {
    this.grid = grid
    const width = grid.cols * CELL_PX
    const height = grid.rows * CELL_PX
    this.engine = new Engine({
      canvasElement: canvas,
      width,
      height,
      displayMode: DisplayMode.FitContainerAndFill,
      backgroundColor: Color.fromHex('#1b2230'),
      suppressPlayButton: true,
    })

    const board = new Actor({ pos: vec(width / 2, height / 2), width, height, z: 0 })
    board.graphics.use(new Canvas({ width, height, cache: true, draw: (ctx) => this.drawBoard(ctx, width, height) }))
    this.engine.add(board)

    this.heroActor = new Actor({ pos: vec(-1000, -1000), width: CELL_PX, height: CELL_PX, z: 1000 })
    this.heroActor.graphics.use(new Canvas({ width: CELL_PX, height: CELL_PX, cache: false, draw: (ctx) => this.drawHero(ctx) }))
    this.heroActor.graphics.isVisible = false
    this.engine.add(this.heroActor)

    this.engine.currentScene.on('preupdate', (event) => this.sync(event.elapsed / 1000))
    void this.engine.start()
    this.loadSounds()
  }

  /** 画面を片付ける (Vue の onBeforeUnmount から呼ぶ) */
  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.engine.stop()
    this.engine.dispose()
    this.views.clear()
    this.bubbles.length = 0
    this.obstacleViews.clear()
  }

  // ---- 効果音 ----

  private loadSounds(): void {
    for (const key of Object.keys(SOUND_FILES) as SoundKey[]) {
      const url = resolveAsset(getSoundPath(SOUND_FOLDER + SOUND_FILES[key].file))
      const sound = new Sound({ paths: [url], maxConcurrentTracks: MAX_CONCURRENT_PER_SOUND })
      sound
        .load()
        .then(() => this.sounds.set(key, sound))
        .catch(() => {
          // 素材がなくても、音が鳴らないだけでゲームは動く
          this.sounds.set(key, null)
          console.warn(`[NuisanceSurvival] 効果音を読み込めませんでした: ${url}`)
        })
    }
  }

  // ---- EffectHost (演出の実体) ----

  play(key: SoundKey): void {
    void this.sounds.get(key)?.play({ volume: SOUND_FILES[key].volume })
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
    const bubbleRequests = this.source.drainBubbles()
    const state = this.source.getState()
    const config = this.source.getConfig()
    const clock = this.source.getClock()

    if (!state || !config) {
      // ゲーム前・メニュー中: 盤面を空にする
      this.clearViews()
      this.clearBubbles()
      this.clearObstacles()
      this.heroActor.graphics.isVisible = false
      this.lastLife = Infinity
      this.heroX = NaN
      return
    }

    this.applyEvents(events, state, clock)
    this.syncNuisances(state, config, clock)
    this.syncHero(state, dt)
    this.syncObstacles(state, clock)
    this.syncBubbles(state, bubbleRequests, dt)
  }

  // ---- ギフト障害物 ----

  /** 障害物を置けなかったギフトの金額を、盤面の上のほうに少しの間だけ出す (無視しない) */
  private showGiftNotice(userName: string, price: number): void {
    const color = obstacleColorOf(price)
    const label = `${userName} ${formatObstaclePrice(price)}`
    const width = Math.min(this.grid.cols * CELL_PX, Math.max(180, label.length * 24 + 32))
    const height = 48
    const actor = new Actor({ pos: vec((this.grid.cols * CELL_PX) / 2, 36 + Math.random() * 40), width, height, z: 1600 })
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
          ctx.font = 'bold 22px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, width / 2, height / 2)
        },
      })
    )
    this.engine.add(actor)
    actor.actions.delay(2500).fade(0, 700).die()
  }

  private clearObstacles(): void {
    for (const v of this.obstacleViews.values()) v.actor.kill()
    this.obstacleViews.clear()
  }

  /** 状態の障害物に合わせて、表示を足す・消す。消える直前の 2 秒は点滅する */
  private syncObstacles(state: GameState, clock: number): void {
    const alive = new Set(state.obstacles.map((o) => o.id))
    for (const [id, v] of this.obstacleViews) {
      if (alive.has(id)) continue
      v.actor.kill()
      this.obstacleViews.delete(id)
    }
    for (const o of state.obstacles) {
      let v = this.obstacleViews.get(o.id)
      if (!v) {
        const w = o.size * CELL_PX
        const actor = new Actor({ pos: vec(0, 0), width: w, height: w, z: 5 })
        actor.graphics.use(new Canvas({ width: w, height: w, cache: true, draw: (ctx) => this.drawObstacle(ctx, o, w) }))
        this.engine.add(actor)
        v = { actor, obstacle: o }
        this.obstacleViews.set(o.id, v)
      }
      v.actor.pos = vec((o.col + o.size / 2) * CELL_PX, (o.row + o.size / 2) * CELL_PX)
      const left = o.expiresAt - state.elapsed
      v.actor.graphics.opacity = left < 2 ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(clock * 16)) : 1
    }
  }

  private drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle, w: number): void {
    const color = obstacleColorOf(o.price)
    ctx.fillStyle = color.background
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(3, 3, w - 6, w - 6, 10)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = color.text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${Math.round(14 + o.size * 4)}px sans-serif`
    ctx.fillText(formatObstaclePrice(o.price), w / 2, w / 2)
  }

  // ---- 吹き出し (視界妨害) ----

  private measureCtx: CanvasRenderingContext2D | null = null

  private clearBubbles(): void {
    for (const b of this.bubbles) b.actor.kill()
    this.bubbles.length = 0
  }

  /** 新しい吹き出しを足し、時間が来たものを消す。濃さは、現れる・消えるときだけフェードする */
  private syncBubbles(state: GameState, requests: CommentBubble[], dt: number): void {
    for (const request of requests) this.addBubble(state, request)
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i]
      b.remaining -= dt
      if (b.remaining <= 0) {
        b.actor.kill()
        this.bubbles.splice(i, 1)
        continue
      }
      const age = BUBBLE_SECONDS - b.remaining
      const fade = clamp(Math.min(age, b.remaining) / BUBBLE_FADE_SECONDS, 0, 1)
      b.actor.graphics.opacity = BUBBLE_ALPHA * fade
    }
  }

  private addBubble(state: GameState, request: CommentBubble): void {
    const label = bubbleLabel(request)
    if (!label) return
    const font = 'bold 22px sans-serif'
    this.measureCtx ??= document.createElement('canvas').getContext('2d')
    if (this.measureCtx) this.measureCtx.font = font
    const textWidth = this.measureCtx?.measureText(label).width ?? label.length * 22
    const width = Math.ceil(textWidth) + 32
    const height = 48
    const { x, y } = pickBubbleCenter(state.hero, this.grid, Math.random)
    const actor = new Actor({ pos: vec(x, y), width, height, z: 1500 })
    actor.graphics.use(
      new Canvas({
        width,
        height,
        cache: true,
        draw: (ctx) => {
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.roundRect(2, 2, width - 4, height - 4, 14)
          ctx.fill()
          ctx.fillStyle = '#222222'
          ctx.font = font
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, width / 2, height / 2)
        },
      })
    )
    actor.graphics.opacity = 0
    this.engine.add(actor)
    this.bubbles.push({ actor, remaining: BUBBLE_SECONDS })
    // 上限を超えたら、古いものから消す
    while (this.bubbles.length > BUBBLE_MAX) this.bubbles.shift()!.actor.kill()
  }

  private applyEvents(events: NuisanceEvent[], state: GameState, clock: number): void {
    for (const event of events) {
      if (event.type === 'enemySpawn') {
        const nuisance = state.nuisances.find((n) => n.id === event.id)
        // すでに消えている (出現と同じ更新で撃破された) ものは、落下を見せない
        if (!nuisance) continue
        const view = this.createView(nuisance, event.isBoss)
        view.fallStartedAt = clock
      } else if (event.type === 'obstacleSkipped') {
        this.showGiftNotice(event.userName, event.price)
      } else if (event.type === 'enemyDeath') {
        const size = event.footprint * CELL_PX
        playDeath(this, event, { x: (event.col + event.footprint / 2) * CELL_PX, y: (event.row + event.footprint / 2) * CELL_PX, size })
      }
    }
  }

  private createView(nuisance: Nuisance, isBoss: boolean): NuisanceView {
    const actor = new Actor({ pos: vec(-1000, -1000), width: VIEW_PX, height: VIEW_PX })
    const view: NuisanceView = { actor, nuisance, fallStartedAt: null, isBoss }
    actor.graphics.use(
      new Canvas({
        width: VIEW_PX,
        height: VIEW_PX,
        cache: false,
        draw: (ctx) => this.drawNuisance(ctx, view),
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

  private syncNuisances(state: GameState, config: NuisanceConfigType, clock: number): void {
    const alive = new Set<number>()
    for (const n of state.nuisances) {
      alive.add(n.id)
      // イベントを取り逃した (表示を切り替えた直後など) ものは、落下なしで表示する
      const view = this.views.get(n.id) ?? this.createView(n, false)
      view.nuisance = n

      const scale = sizeScaleOf(n, config)
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

    // ライフが減ったとき、主人公を赤くする
    if (state.life < this.lastLife - 0.01) this.flashRemaining = FLASH_SECONDS
    this.lastLife = state.life
    this.flashRemaining = Math.max(0, this.flashRemaining - dt)
  }

  // ---- 描き方 (Canvas 2D。見た目は前の実装のまま) ----

  private drawBoard(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = '#1b2230'
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let c = 0; c <= this.grid.cols; c++) {
      ctx.moveTo(c * CELL_PX + 0.5, 0)
      ctx.lineTo(c * CELL_PX + 0.5, height)
    }
    for (let r = 0; r <= this.grid.rows; r++) {
      ctx.moveTo(0, r * CELL_PX + 0.5)
      ctx.lineTo(width, r * CELL_PX + 0.5)
    }
    ctx.stroke()
  }

  private getImage(url: string): HTMLImageElement | null {
    if (!/^(https?:|data:image\/)/.test(url)) return null
    const cached = this.images.get(url)
    if (cached === undefined) {
      const image = new Image()
      // CORS つきで読み込む (つけないと、描いた canvas が汚染されて、WebGL がテクスチャにできず Fatal になる)。
      // 相手のサーバーが CORS を許可していない画像は、読み込みに失敗して、頭文字の表示になる
      image.crossOrigin = 'anonymous'
      image.onerror = () => this.images.set(url, null) // 読み込めなかった画像は、再試行しない
      image.src = url
      this.images.set(url, image)
      return null
    }
    return cached && cached.complete && cached.naturalWidth > 0 ? cached : null
  }

  private drawNuisance(ctx: CanvasRenderingContext2D, view: NuisanceView): void {
    const config = this.source.getConfig()
    if (!config) return
    const n = view.nuisance
    const clock = this.source.getClock()
    const scale = sizeScaleOf(n, config)
    const footprint = footprintOf(scale)
    const cx = VIEW_PX / 2
    const cy = VIEW_PX / 2
    const radius = (CELL_PX * clamp(scale, footprint - 0.5, footprint) * 0.9) / 2
    const { hue } = n.traits

    // 本体
    ctx.fillStyle = `hsl(${hue} 65% 52%)`
    ctx.strokeStyle = `hsl(${hue} 70% 25%)`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // アイコン (なければ頭文字)
    const image = this.getImage(n.profileImage)
    if (image) {
      const iconRadius = radius * 0.72
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, iconRadius, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(image, cx - iconRadius, cy - iconRadius, iconRadius * 2, iconRadius * 2)
      ctx.restore()
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.font = `bold ${Math.round(radius * 0.9)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(Array.from(n.userName)[0] ?? '?', cx, cy)
    }

    // 種類のしるし
    const glyph = KIND_GLYPH[n.traits.kind]
    if (glyph) {
      ctx.font = `${Math.round(CELL_PX * 0.3)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(glyph, cx + radius * 0.72, cy - radius * 0.72)
    }

    // 爆発までの時間 (残りが少ないほど、赤い輪が点滅する)
    if (n.fuse !== null && n.traits.fuseSeconds) {
      const remaining = n.fuse / n.traits.fuseSeconds
      const blink = n.fuse < 4 ? 0.5 + 0.5 * Math.sin(clock * 14) : 1
      ctx.strokeStyle = `rgba(255,70,70,${0.35 + 0.65 * blink})`
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(remaining, 0, 1))
      ctx.stroke()
    }
  }

  private drawHero(ctx: CanvasRenderingContext2D): void {
    const cx = CELL_PX / 2
    const cy = CELL_PX / 2
    const radius = CELL_PX * 0.34
    ctx.fillStyle = this.flashRemaining > 0 ? '#ff5a5a' : '#f5f7fa'
    ctx.strokeStyle = '#2d6cdf'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    // 目
    ctx.fillStyle = '#1b2230'
    ctx.beginPath()
    ctx.arc(cx - radius * 0.35, cy - radius * 0.1, radius * 0.12, 0, Math.PI * 2)
    ctx.arc(cx + radius * 0.35, cy - radius * 0.1, radius * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** 色相・彩度・明るさ (0〜360 / 0〜100 / 0〜100) を、Excalibur の Color が受け取る RGB (0〜255) に直す */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const sat = s / 100
  const light = l / 100
  const a = sat * Math.min(light, 1 - light)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}
