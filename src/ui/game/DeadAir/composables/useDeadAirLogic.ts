// src/ui/game/DeadAir/composables/useDeadAirLogic.ts
import { computed, onUnmounted, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { DEAD_AIR_BUILTIN_COUNTER_KEYS, type DeadAirEventRuleType, type DeadAirType } from '@/types/ui'

export type DeadAirPhase = 'running' | 'gameOver'

/** 設定で使われているカウンターのキー(重複なし・空は除く) */
export const collectDeadAirCounterKeys = (settings: DeadAirType): string[] => {
  const keys = settings.eventRules.map((r) => r.counterKey)
  if (settings.optionalCounterKey) keys.push(settings.optionalCounterKey)
  return [...new Set(keys.filter(Boolean))]
}

/** useStreamCounters へ渡す「変数カウンター」(組み込みキーは除く)。キー → ラベルの対応 */
export const toDeadAirVariableLabelMap = (settings: DeadAirType): Record<string, string> => {
  const builtin = new Set<string>(DEAD_AIR_BUILTIN_COUNTER_KEYS)
  return Object.fromEntries(
    collectDeadAirCounterKeys(settings)
      .filter((key) => !builtin.has(key))
      .map((key) => [key, key])
  )
}

/**
 * DeadAir の状態機械。本番(DeadAir.vue)とエディタのプレビューで共有する。
 * @param counters useStreamCounters の counters(computed)か、プレビュー用の仮カウンター(reactive)
 * @param speed 1 秒あたりに進める秒数の倍率。本番は 1、プレビューは 1 / 10 を切り替える。
 *              ペナルティで加速させたいときは、この ref を書き換える。
 */
export function useDeadAirLogic(
  settings: Ref<DeadAirType>,
  counters: MaybeRefOrGetter<Readonly<Record<string, number>>>,
  speed: Ref<number> = ref(1)
) {
  const maxSeconds = computed(() => settings.value.initialMinutes * 60)
  const phase = ref<DeadAirPhase>('running')
  const remainSeconds = ref(maxSeconds.value)
  const currentLives = ref(settings.value.initialLives)
  const bonusAccumSeconds = ref(0)

  const lifeFraction = computed(() =>
    settings.value.initialLives > 0 ? currentLives.value / settings.value.initialLives : 0
  )

  const bonusFraction = computed(() =>
    settings.value.bonusEnabled && maxSeconds.value > 0 ? Math.min(bonusAccumSeconds.value / maxSeconds.value, 1) : 0
  )

  const optionalValue = computed(() => {
    const key = settings.value.optionalCounterKey
    return key ? (toValue(counters)[key] ?? 0) : null
  })

  const formattedTime = computed(() => {
    const total = Math.max(Math.ceil(remainSeconds.value), 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const isWarning = computed(() => remainSeconds.value <= 30 && remainSeconds.value > 0)
  const isCritical = computed(() => remainSeconds.value <= 10 && remainSeconds.value > 0)

  // タイマー(1 秒ごとに speed 秒ぶん進める)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const startTimer = () => {
    if (!intervalId) intervalId = setInterval(tick, 1000)
  }
  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const loseLife = () => {
    bonusAccumSeconds.value = 0
    currentLives.value -= 1
    if (currentLives.value <= 0) {
      currentLives.value = 0
      phase.value = 'gameOver'
      stopTimer()
      return
    }
    remainSeconds.value = maxSeconds.value
  }

  const tick = () => {
    if (phase.value === 'gameOver') return
    remainSeconds.value -= Math.max(speed.value, 0)
    if (remainSeconds.value <= 0) {
      remainSeconds.value = 0
      loseLife()
    }
  }

  // イベントルール
  const addTimer = (seconds: number) => {
    const newVal = remainSeconds.value + seconds
    if (newVal <= maxSeconds.value) {
      remainSeconds.value = newVal
      return
    }
    remainSeconds.value = maxSeconds.value
    if (settings.value.bonusEnabled) {
      bonusAccumSeconds.value += newVal - maxSeconds.value
      if (bonusAccumSeconds.value >= maxSeconds.value) {
        bonusAccumSeconds.value -= maxSeconds.value
        currentLives.value = Math.min(currentLives.value + 1, settings.value.initialLives)
      }
    }
  }

  const applyEffect = (rule: DeadAirEventRuleType) => {
    if (rule.effect === 'timer') addTimer(rule.value * 60)
    else currentLives.value = Math.min(currentLives.value + rule.value, settings.value.initialLives)
  }

  // カウンターが増えた分だけ効果を発動する。基準値 (lastSeen) は、最初の値から始める。
  // (useStreamCounters の値は最初から入っているので、マウント直後の初期値を「増加」と誤認することはない)
  let lastSeen: Record<string, number> = { ...toValue(counters) }

  const unwatchCounters = watch(
    () => ({ ...toValue(counters) }),
    (current) => {
      const prev = lastSeen
      lastSeen = { ...current }
      if (phase.value === 'gameOver') return
      for (const rule of settings.value.eventRules) {
        const key = rule.counterKey
        if (!key) continue
        const curr = current[key] ?? 0
        const p = prev[key] ?? 0
        if (curr <= p) continue
        const times = Math.floor(curr / rule.threshold) - Math.floor(p / rule.threshold)
        for (let i = 0; i < times; i++) applyEffect(rule)
      }
    }
  )

  // リセット(設定変更時・プレビューの「最初から」)
  const reset = () => {
    stopTimer()
    phase.value = 'running'
    remainSeconds.value = maxSeconds.value
    currentLives.value = settings.value.initialLives
    bonusAccumSeconds.value = 0
    lastSeen = { ...toValue(counters) }
    startTimer()
  }

  const unwatchSettings = watch(() => [settings.value.initialMinutes, settings.value.initialLives], reset)

  startTimer()

  onUnmounted(() => {
    stopTimer()
    unwatchCounters()
    unwatchSettings()
  })

  return {
    phase,
    formattedTime,
    isWarning,
    isCritical,
    currentLives,
    bonusFraction,
    lifeFraction,
    optionalValue,
    reset,
  }
}
