<!-- src/console/game/NuisanceSurvival/components/NuisanceField.vue -->
<!-- 盤面の描画 (canvas)。ゲームの進行は state が持ち、ここは描くだけ。画面の大きさに合わせて縮尺が変わる -->
<template>
  <canvas ref="canvasRef" :width="width" :height="height" class="h-full w-full object-contain" />
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { CELL_PX, HERO_MOVE_INTERVAL_SECONDS } from '../scripts/nuisanceConstants'
  import type { NuisanceConfigType } from '../scripts/nuisanceConfig'
  import {
    DEFAULT_GRID,
    footprintOf,
    pushNeededOf,
    sizeScaleOf,
    type GameState,
    type GridSize,
    type Nuisance,
  } from '../scripts/nuisanceEngine'
  import type { NuisanceKind } from '../scripts/nuisanceTraits'

  const props = defineProps<{
    state: GameState | null
    config: NuisanceConfigType | null
    /** 描画用の時計 (開始からの秒)。実時間で進むので、更新の合間もなめらかに動かせる */
    getClock: () => number
  }>()

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const grid = computed<GridSize>(() => props.state?.grid ?? DEFAULT_GRID)
  const width = computed(() => grid.value.cols * CELL_PX)
  const height = computed(() => grid.value.rows * CELL_PX)

  /** 動いたときに、前のマスから新しいマスへ動かす時間 (秒) */
  const MOVE_ANIM_SECONDS = 0.15
  const FLASH_SECONDS = 0.25
  const KIND_GLYPH: Record<NuisanceKind, string> = {
    static: '',
    wanderer: '👣',
    evader: '💨',
    creeper: '💕',
    bouncer: '⇄',
    bomber: '💣',
    boss: '👑',
  }

  // ---- アイコン画像 (読み込めるまでは、頭文字を出す) ----
  const images = new Map<string, HTMLImageElement | null>()
  const getImage = (url: string): HTMLImageElement | null => {
    if (!/^(https?:|data:image\/)/.test(url)) return null
    const cached = images.get(url)
    if (cached === undefined) {
      const image = new Image()
      image.onerror = () => images.set(url, null) // 読み込めなかった画像は、再試行しない
      image.src = url
      images.set(url, image)
      return null
    }
    return cached && cached.complete && cached.naturalWidth > 0 ? cached : null
  }

  // ---- 描画 ----
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

  let frameId = 0
  let lastFrameAt = 0
  let lastLife = Infinity
  let flashUntil = 0
  let heroX = NaN
  let heroY = NaN

  const drawBoard = (ctx: CanvasRenderingContext2D, g: GridSize) => {
    ctx.fillStyle = '#1b2230'
    ctx.fillRect(0, 0, g.cols * CELL_PX, g.rows * CELL_PX)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let c = 0; c <= g.cols; c++) {
      ctx.moveTo(c * CELL_PX + 0.5, 0)
      ctx.lineTo(c * CELL_PX + 0.5, g.rows * CELL_PX)
    }
    for (let r = 0; r <= g.rows; r++) {
      ctx.moveTo(0, r * CELL_PX + 0.5)
      ctx.lineTo(g.cols * CELL_PX, r * CELL_PX + 0.5)
    }
    ctx.stroke()
  }

  const drawNuisance = (ctx: CanvasRenderingContext2D, n: Nuisance, config: NuisanceConfigType, clock: number) => {
    const scale = sizeScaleOf(n, config)
    const footprint = footprintOf(scale)
    const t = clamp((clock - n.movedAt) / MOVE_ANIM_SECONDS, 0, 1)
    const eased = 1 - (1 - t) * (1 - t)
    const cx = (lerp(n.prevCol, n.col, eased) + footprint / 2) * CELL_PX
    const cy = (lerp(n.prevRow, n.row, eased) + footprint / 2) * CELL_PX
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
    const image = getImage(n.profileImage)
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

    // 押している進み具合
    if (n.pushed > 0) {
      const progress = clamp(n.pushed / pushNeededOf(n, config), 0, 1)
      ctx.strokeStyle = '#7CFC9A'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(cx, cy, radius - 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress)
      ctx.stroke()
      ctx.lineCap = 'butt'
    }
  }

  const drawHero = (ctx: CanvasRenderingContext2D, state: GameState, dt: number, now: number) => {
    const targetX = (state.hero.col + 0.5) * CELL_PX
    const targetY = (state.hero.row + 0.5) * CELL_PX
    if (Number.isNaN(heroX)) {
      heroX = targetX
      heroY = targetY
    }
    const follow = Math.min(1, dt / (HERO_MOVE_INTERVAL_SECONDS * 0.6))
    heroX += (targetX - heroX) * follow
    heroY += (targetY - heroY) * follow

    const flashing = now < flashUntil
    const radius = CELL_PX * 0.34
    ctx.fillStyle = flashing ? '#ff5a5a' : '#f5f7fa'
    ctx.strokeStyle = '#2d6cdf'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(heroX, heroY, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    // 目
    ctx.fillStyle = '#1b2230'
    ctx.beginPath()
    ctx.arc(heroX - radius * 0.35, heroY - radius * 0.1, radius * 0.12, 0, Math.PI * 2)
    ctx.arc(heroX + radius * 0.35, heroY - radius * 0.1, radius * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }

  const frame = (timestamp: number) => {
    frameId = requestAnimationFrame(frame)
    const canvas = canvasRef.value
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dt = lastFrameAt ? (timestamp - lastFrameAt) / 1000 : 0
    lastFrameAt = timestamp

    const g = grid.value
    drawBoard(ctx, g)

    const state = props.state
    const config = props.config
    if (!state || !config) {
      lastLife = Infinity
      heroX = NaN
      return
    }

    // ライフが減ったとき、主人公を赤くする
    if (state.life < lastLife - 0.01) flashUntil = timestamp + FLASH_SECONDS * 1000
    lastLife = state.life

    const clock = props.getClock()
    // 大きい邪魔者を後ろに、小さいものを前に描く (小さいものが隠れないように)
    const ordered = [...state.nuisances].sort((a, b) => sizeScaleOf(b, config) - sizeScaleOf(a, config))
    for (const n of ordered) drawNuisance(ctx, n, config, clock)
    drawHero(ctx, state, dt, timestamp)
  }

  onMounted(() => {
    frameId = requestAnimationFrame(frame)
  })
  onBeforeUnmount(() => cancelAnimationFrame(frameId))
</script>
