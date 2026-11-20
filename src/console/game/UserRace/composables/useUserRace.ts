// src/console/game/UserRace/composables/useUserRace.ts
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { userStatsApi } from '@/manager/services/userStatsApi'
import { gameStateApi } from '@/manager/services/gameStateApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import type { ConsoleStatus } from '@/console/types'
import { createStreamId } from '@/console/common/scripts/streamId'
import {
  GAME_KEY,
  MIN_RACERS,
  buildGameLogs,
  createRace,
  createRng,
  getRanking,
  getResults,
  pickRacers,
  stepRace,
  type RaceState,
} from '../scripts/raceEngine'

export type RacePhase = 'idle' | 'loading' | 'countdown' | 'running' | 'finished'
/** ゲームログへの記録の状態 */
export type RecordStatus = 'idle' | 'saving' | 'saved' | 'error'

const COUNTDOWN_SECONDS = 3
/** 1 フレームで進める時間の上限 (秒)。ウィンドウが隠れて止まっていたあとに、一気に進まないようにする */
const MAX_FRAME_SECONDS = 0.1

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/**
 * ユーザーレースの進行
 * idle → loading (ユーザー取得) → countdown → running → finished
 * - 結果 (全員の順位) は、レースが終わると自動でゲームログ (GameLog) に記録する。保存先は、このウィンドウを開いた日時の配信ID
 * - ユーザーの得点 (update-user-stats) は変えない。得点は LiveConsole の手動操作だけ (docs/conventions/obs-server-access.md)
 */
export function useUserRace() {
  const phase = ref<RacePhase>('idle')
  const status = ref<ConsoleStatus>('online')
  const errorMessage = ref('')
  const notEnough = ref(false)
  const race = shallowRef<RaceState | null>(null)
  const countdown = ref(0)

  const recordStatus = ref<RecordStatus>('idle')
  const recordError = ref('')
  /** ゲームログの保存先 (1配信 = 1ファイル)。このウィンドウを開いている間は、同じファイルに残す */
  const streamId = createStreamId()
  let raceId = ''
  let recordedAt = 0

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

  /** 結果をゲームログに記録する (同じ内容を何度送っても、サーバーが二重に保存しない。失敗したら再試行できる) */
  const record = async () => {
    const current = race.value
    if (!current || !raceId || recordStatus.value === 'saving' || recordStatus.value === 'saved') return
    const id = raceId
    recordStatus.value = 'saving'
    recordError.value = ''
    try {
      await gameStateApi.appendGameLogs(streamId, GAME_KEY, buildGameLogs(current, id, recordedAt))
      if (id === raceId) recordStatus.value = 'saved'
    } catch (error) {
      if (id !== raceId) return // 保存中に、次のレースが始まっていた
      recordStatus.value = 'error'
      recordError.value = error instanceof ConnectionError ? 'サーバーに接続できません' : messageOf(error)
    }
  }

  const tick = (timestamp: number) => {
    if (phase.value !== 'running' || !race.value) return
    const dt = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, MAX_FRAME_SECONDS) : 0
    lastTimestamp = timestamp
    race.value = stepRace(race.value, dt)
    if (race.value.finished) {
      phase.value = 'finished'
      recordedAt = Date.now()
      void record()
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
    recordStatus.value = 'idle'
    recordError.value = ''
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
    raceId = `race-${Date.now().toString(36)}-${Math.floor(rng() * 0x10000).toString(36)}`
    startCountdown()
  }

  const reset = () => {
    stopTimers()
    phase.value = 'idle'
    race.value = null
    notEnough.value = false
    recordStatus.value = 'idle'
    recordError.value = ''
    raceId = ''
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
    recordStatus,
    recordError,
    streamId,
    start,
    reset,
    record,
  }
}
