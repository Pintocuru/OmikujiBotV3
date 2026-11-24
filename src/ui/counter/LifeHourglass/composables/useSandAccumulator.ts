// src/ui/counter/LifeHourglass/composables/useSandAccumulator.ts
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStreamCounters } from '@/ui/common/useStreamCounters'
import { useAppStore } from '@/generator/stores/useAppStore'
import { useLifeHourglassStore } from './useLifeHourglassStore'
import { LIFE_HOURGLASS_GRAINS_PER_YEN } from './bowls'

/** 同接ぶんの加算間隔(秒)。数値が滑らかに増えるよう 1 秒。経過秒数は実時間から計算する(タイマーの回数に頼らない) */
const VIEWER_INTERVAL_SECONDS = 1

/**
 * 砂粒の加算(同接・ギフト)と保存。
 * 数値の取得は StreamCounter と同じく useStreamCounters を使う(新しい取得処理は作らない)。
 * - 同接ぶん: 一定間隔で「同接 × 経過秒数」をまとめて加算
 * - ギフトぶん: ギフトの累計金額が増えた時点で「増分 × 6 粒」を加算
 * - 取得できないときは加算を止めて、エラーにしない
 */
export const useSandAccumulator = () => {
  const store = useLifeHourglassStore()
  // 評価ブロックの変数カウンターは使わない(空のマップで固定)
  const { counters } = useStreamCounters(computed<Record<string, string>>(() => ({})))

  /** ギフトで砂粒が増えた回数(落ちる演出のトリガー) */
  const giftPulse = ref(0)

  /** 配信時間(秒)。配信開始時刻(ServiceMeta.startTime)からの経過時間。取れないときは、この UI を開いてからの経過時間 */
  const streamSeconds = ref(0)
  const openedAt = Date.now()

  // 配信開始時刻は、ServiceMetaStore が既に持っている startTime を使う(新しい取得処理は作らない)
  const appStore = useAppStore()
  const metaStartTime = computed<number | null>(() => {
    const t = appStore.serviceMetaStore.getCurrent()?.startTime
    if (typeof t !== 'number' || !Number.isFinite(t) || t <= 0) return null
    // 秒で来た場合に備える(ミリ秒なら 1e12 以上)
    return t < 1e12 ? t * 1000 : t
  })

  // --- 同接ぶん ---
  let lastTickAt = Date.now()
  let timer: ReturnType<typeof setInterval> | null = null

  const tick = () => {
    const now = Date.now()
    streamSeconds.value = Math.max(0, Math.floor((now - (metaStartTime.value ?? openedAt)) / 1000))
    const elapsedSeconds = (now - lastTickAt) / 1000
    lastTickAt = now
    const viewer = counters.value.viewer
    // 同接が取れない(0・非数)ときは加算しない
    if (!Number.isFinite(viewer) || viewer <= 0 || elapsedSeconds <= 0) return
    void store.add(viewer * elapsedSeconds)
  }

  // --- ギフトぶん(累計金額の増分) ---
  let lastTotalPrice: number | null = null
  const stopGiftWatch = watch(
    () => counters.value.totalPrice,
    (total) => {
      // ギフト金額が取れないときは、基準をリセットして加算を止める
      if (typeof total !== 'number' || !Number.isFinite(total) || total < 0) {
        lastTotalPrice = null
        return
      }
      if (lastTotalPrice !== null) {
        const delta = Math.floor(total - lastTotalPrice)
        if (delta > 0) {
          void store.add(delta * LIFE_HOURGLASS_GRAINS_PER_YEN)
          giftPulse.value++
        }
      }
      lastTotalPrice = total
    },
    // 最初の値を基準にする (最初の値が入る前に増えたギフトを、増分として数えないため)
    { immediate: true }
  )

  onMounted(() => {
    // 起動時に通算を読み込む(1回)。読み込み後の基準が carryOver=false の表示になる
    void store.load()
    lastTickAt = Date.now()
    timer = setInterval(tick, VIEWER_INTERVAL_SECONDS * 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
    stopGiftWatch()
    // 仮実装では送信する先がないため、未送信分のフラッシュはしない
  })

  return {
    giftPulse,
    streamSeconds,
    /** 現在の同時接続数 */
    viewer: computed(() => counters.value.viewer),
    /** ギフト合計(円) */
    giftTotal: computed(() => counters.value.totalPrice),
  }
}
