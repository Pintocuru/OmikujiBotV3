// src/ui/SnipeTimer/types.ts

/** idle: 待機(開始前・リセット後) / running: カウント中 / paused: 一時停止 / finished: 0 になった */
export type SnipeTimerStatus = 'idle' | 'running' | 'paused' | 'finished'

/** 表示コンポーネントに渡すタイマーの状態 */
export type SnipeTimerState = {
  status: SnipeTimerStatus
  isVisible: boolean // 表示するか(alwaysVisible=false では、カウント中と終了後だけ)
  countdown: number // 残り秒数
  displayTime: string // 目標時刻(HH:MM:SS)。未設定は '---'
}
