// src/ui/SnipeTimer/useSnipeTimerCore.ts
import { computed, onUnmounted, reactive, watch, type Ref } from 'vue'
import { SNIPE_TIMER_INITIAL_SECONDS, type SnipeTimerType } from '@/types/ui'
import { alignSnipeTime } from '@/common/SnipeTimer/parseSnipeTime'
import type { SnipeTimerState } from './types'

const TICK_MS = 100

/**
 * スナイプタイマーの状態と操作
 * - 目標時刻の決め方(コメントのパースなど)は持たない。目標時刻は receive / toggle で受け取る
 * - 左クリック(toggle): 開始 / 一時停止 / 再開、右クリック(reset): リセット(カウント中は何もしない)
 */
export const useSnipeTimerCore = (settings: Ref<SnipeTimerType>) => {
  const state = reactive<SnipeTimerState>({
    status: 'idle',
    isVisible: settings.value.alwaysVisible,
    countdown: settings.value.initialSeconds,
    displayTime: '---',
  })

  let targetMs = 0
  let remainingMs = 0 // 一時停止中の残り時間
  let tickTimer: number | undefined
  let hideTimer: number | undefined

  const digits = computed(() => state.countdown.toString().padStart(2, '0').split('').map(Number))

  // ---- タイマー ----
  const stopTick = () => {
    window.clearInterval(tickTimer)
    tickTimer = undefined
  }
  const clearHide = () => {
    window.clearTimeout(hideTimer)
    hideTimer = undefined
  }

  // alwaysVisible=false のとき、afterShowSeconds 後に隠す
  const scheduleHide = () => {
    clearHide()
    if (settings.value.alwaysVisible) return
    hideTimer = window.setTimeout(() => (state.isVisible = false), settings.value.afterShowSeconds * 1000)
  }

  const finish = () => {
    stopTick()
    state.countdown = 0
    state.status = 'finished'
    scheduleHide()
  }

  const tick = () => {
    const diff = targetMs - Date.now()
    if (diff > 0) state.countdown = Math.ceil(diff / 1000)
    else finish()
  }

  const begin = (nextTargetMs: number) => {
    stopTick()
    clearHide()
    targetMs = nextTargetMs
    state.displayTime = new Date(targetMs).toTimeString().slice(0, 8)
    state.status = 'running'
    state.isVisible = true
    tick()
    if (state.status === 'running') tickTimer = window.setInterval(tick, TICK_MS)
  }

  // ---- 操作 ----
  /** 目標時刻(エポックミリ秒)を受け取って開始する。カウント中、過去の時刻は受け付けない */
  const receive = (target: number) => {
    if (state.status === 'running' || target <= Date.now()) return
    begin(target)
  }

  const startFromInitial = () => {
    const now = new Date()
    const raw = new Date(now.getTime() + settings.value.initialSeconds * 1000)
    const aligned = alignSnipeTime(
      raw,
      {
        minSeconds: SNIPE_TIMER_INITIAL_SECONDS.min,
        maxSeconds: SNIPE_TIMER_INITIAL_SECONDS.max,
        secondAdjust: settings.value.secondAdjust,
      },
      now
    )
    if (aligned) begin(aligned.getTime())
  }

  const pause = () => {
    remainingMs = Math.max(0, targetMs - Date.now())
    stopTick()
    state.status = 'paused'
  }

  const resume = () => begin(Date.now() + remainingMs)

  /** 左クリック: 待機・終了後は開始、カウント中は一時停止、一時停止中は再開 */
  const toggle = () => {
    if (state.status === 'running') pause()
    else if (state.status === 'paused') resume()
    else startFromInitial()
  }

  /** 右クリック: 停止しているときだけ、初期値に戻す */
  const reset = () => {
    if (state.status === 'running') return
    stopTick()
    state.status = 'idle'
    state.countdown = settings.value.initialSeconds
    state.displayTime = '---'
    scheduleHide()
  }

  // ---- 設定の変更に追従 ----
  watch(
    () => settings.value.alwaysVisible,
    (always) => {
      if (always) {
        clearHide()
        state.isVisible = true
      } else if (state.status === 'idle') {
        state.isVisible = false
      }
    }
  )
  watch(
    () => settings.value.initialSeconds,
    (seconds) => {
      if (state.status === 'idle') state.countdown = seconds
    }
  )

  onUnmounted(() => {
    stopTick()
    clearHide()
  })

  return { state, digits, receive, toggle, reset }
}
