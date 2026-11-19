// src/console/game/UserRace/composables/useUserRace.ts
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { userStatsApi } from '@/manager/services/userStatsApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import type { ConsoleStatus } from '@/console/types'
import {
  MIN_RACERS,
  buildScoreUpdates,
  createRace,
  createRng,
  getRanking,
  getResults,
  pickRacers,
  stepRace,
  type RaceState,
} from '../scripts/raceEngine'

export type RacePhase = 'idle' | 'loading' | 'countdown' | 'running' | 'finished'

const COUNTDOWN_SECONDS = 3
/** 1 フレームで進める時間の上限 (秒)。ウィンドウが隠れて止まっていたあとに、一気に進まないようにする */
const MAX_FRAME_SECONDS = 0.1

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/**
 * ユーザーレースの進行
 * idle → loading (ユーザー取得) → countdown → running → finished。得点の加算は、結果が出たあとに手動で 1 回だけ
 */
export function useUserRace() {
  const phase = ref<RacePhase>('idle')
  const status = ref<ConsoleStatus>('online')
  const errorMessage = ref('')
  const notEnough = ref(false)
  const race = shallowRef<RaceState | null>(null)
  const countdown = ref(0)

  const applying = ref(false)
  const applied = ref(false)
  const applyError = ref('')

  let frameId = 0
  let lastTimestamp = 0
  let countdownTimer: ReturnType<typeof setInterval> | undefined

  const results = computed(() => (race.value ? getResults(race.value) : []))
  /** ゴールした人の順位 (userId → 順位)。レーンにゴールの順位を出すのに使う */
  const ranks = computed(
    () => new Map((race.value ? getRanking(race.value) : []).map(({ rank, racer }) => [racer.userId, rank]))
  )

  const stopTimers = () => {
    cancelAnimationFrame(frameId)
    if (countdownTimer) clearInterval(countdownTimer)
    countdownTimer = undefined
  }

  const tick = (timestamp: number) => {
    if (phase.value !== 'running' || !race.value) return
    const dt = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, MAX_FRAME_SECONDS) : 0
    lastTimestamp = timestamp
    race.value = stepRace(race.value, dt)
    if (race.value.finished) {
      phase.value = 'finished'
      return
    }
    frameId = requestAnimationFrame(tick)
  }

  const run = () => {
    phase.value = 'running'
    lastTimestamp = 0
    frameId = requestAnimationFrame(tick)
  }

  const startCountdown = () => {
    phase.value = 'countdown'
    countdown.value = COUNTDOWN_SECONDS
    countdownTimer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value > 0) return
      clearInterval(countdownTimer)
      countdownTimer = undefined
      run()
    }, 1000)
  }

  const start = async () => {
    if (phase.value === 'loading' || phase.value === 'countdown' || phase.value === 'running') return
    stopTimers()
    phase.value = 'loading'
    notEnough.value = false
    errorMessage.value = ''
    applied.value = false
    applyError.value = ''
    race.value = null

    // 走る人は、スタートのたびに最新のユーザーリストから選ぶ
    let users
    try {
      users = (await userStatsApi.loadUsers()).users
      status.value = 'online'
    } catch (error) {
      if (error instanceof ConnectionError) {
        status.value = 'offline'
      } else {
        status.value = 'error'
        errorMessage.value = messageOf(error)
      }
      phase.value = 'idle'
      return
    }

    const rng = createRng((Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0)
    const racers = pickRacers(users, rng)
    if (racers.length < MIN_RACERS) {
      notEnough.value = true
      phase.value = 'idle'
      return
    }
    race.value = createRace(racers, rng)
    startCountdown()
  }

  const reset = () => {
    stopTimers()
    phase.value = 'idle'
    race.value = null
    notEnough.value = false
    applied.value = false
    applyError.value = ''
  }

  /** 1〜3位に得点を加算する (手動のボタンから。1 回だけ) */
  const applyPoints = async () => {
    if (phase.value !== 'finished' || applied.value || applying.value || results.value.length === 0) return
    applying.value = true
    applyError.value = ''
    try {
      await userStatsApi.updateUserStats(buildScoreUpdates(results.value))
      applied.value = true
    } catch (error) {
      applyError.value = messageOf(error)
    } finally {
      applying.value = false
    }
  }

  onBeforeUnmount(stopTimers)

  return {
    phase,
    status,
    errorMessage,
    notEnough,
    race,
    countdown,
    results,
    ranks,
    applying,
    applied,
    applyError,
    start,
    reset,
    applyPoints,
  }
}
