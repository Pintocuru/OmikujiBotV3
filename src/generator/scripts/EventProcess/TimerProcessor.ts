// src/generator/scripts/EventProcess/TimerProcessor.ts
import { TimerEventType } from '@/types/OmikujiData/'
import { useAppStore } from '@/generator/stores/useAppStore'
import { OmikujiProcessor } from '@/generator/scripts/EventProcess/OmikujiProcessor'
import { checkTimerExpression } from '@/generator/scripts/trigger/checkers/ExpressionChecker'

interface TimerState {
  timerId: number
  initialTimerId?: number // interval: 初回実行用 / range: 現在予約中のタイマー
}

/** ランジの抽選単位 (ms) */
const RANGE_STEP_MS = 500

/**
 * タイマーイベントの実行を管理
 *
 * データは useAppStore から直接取得します。
 * データが更新された場合は、stopTimers() を呼んでから startTimers() を再度呼び出してください。
 */
export class EventTimerProcessor {
  private readonly activeTimers = new Map<string, TimerState>()
  private readonly omikujiProcessor: OmikujiProcessor = new OmikujiProcessor()

  /**
   * すべてのタイマーを開始
   * onStart イベントは即時実行のみ行い、タイマー管理には含めない
   */
  startTimers(): void {
    this.stopTimers()

    const appStore = useAppStore()
    const enabledTimers = Object.values(appStore.data.events.timers)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    enabledTimers.forEach((rule) => {
      switch (rule.mode) {
        case 'onStart':
          this.executeEvent(rule)
          break
        case 'range':
          this.startRangeTimer(rule)
          break
        default:
          // mode === 'interval'（デフォルト）
          this.startIntervalTimer(rule)
      }
    })
  }

  /**
   * interval モード: 定期実行
   */
  private startIntervalTimer(rule: TimerEventType): void {
    const intervalMs = rule.intervalSeconds * 1000
    let initialDelay = intervalMs

    // isBaseZeroがtrueの場合、0分0秒を基準にする
    if (rule.isBaseZero) {
      const now = new Date()
      const msSinceHourStart = now.getMinutes() * 60_000 + now.getSeconds() * 1000 + now.getMilliseconds()
      initialDelay = intervalMs - (msSinceHourStart % intervalMs)
    }

    // 初回実行用のタイマー
    const initialTimerId = window.setTimeout(() => {
      this.executeEvent(rule)

      // 定期実行を開始
      const intervalTimerId = window.setInterval(() => {
        this.executeEvent(rule)
      }, intervalMs)

      // タイマー状態を更新
      const timerState = this.activeTimers.get(rule.key)
      if (timerState) {
        timerState.timerId = intervalTimerId
        timerState.initialTimerId = undefined
      }
    }, initialDelay)

    // タイマー状態を記録
    this.activeTimers.set(rule.key, {
      timerId: 0, // 初回実行後に更新される
      initialTimerId,
    })
  }

  /**
   * range モード (ランジ): 最短〜最長の間でランダムな間隔で発火
   * 毎回 setTimeout を張り直す。次の予約を先に行うので、処理時間が間隔に影響しない
   */
  private startRangeTimer(rule: TimerEventType): void {
    const state: TimerState = { timerId: 0 }
    this.activeTimers.set(rule.key, state)

    const schedule = () => {
      state.initialTimerId = window.setTimeout(() => {
        schedule()
        void this.executeEvent(rule)
      }, this.pickRangeDelayMs(rule))
    }
    schedule()
  }

  /**
   * 0.5秒刻みで [最短, 最長] (両端を含む) から待ち時間を抽選
   * 最短 > 最長 の場合は入れ替えて扱う
   */
  private pickRangeDelayMs(rule: TimerEventType): number {
    const lo = Math.min(rule.rangeMinSeconds, rule.rangeMaxSeconds)
    const hi = Math.max(rule.rangeMinSeconds, rule.rangeMaxSeconds)
    const steps = Math.round(((hi - lo) * 1000) / RANGE_STEP_MS)
    return lo * 1000 + Math.floor(Math.random() * (steps + 1)) * RANGE_STEP_MS
  }

  /**
   * おみくじを実行して BotMessage をスケジュールする (onStart / interval / range 共通)
   * expression (動作条件) が成立しないときはその回の発火をスキップする (タイマー自体は止めない)
   */
  private async executeEvent(event: TimerEventType): Promise<void> {
    try {
      if (!checkTimerExpression(event.expression)) return

      const appStore = useAppStore()
      const messages = await this.omikujiProcessor.executeOmikuji(event.key, event.omikujiKey, 'timers')
      appStore.scheduleBotMessages(messages)
    } catch (error) {
      console.error(`Timer ${event.key} execution error:`, error)
    }
  }

  /**
   * すべてのタイマーを停止
   */
  stopTimers(): void {
    this.activeTimers.forEach((timerState) => {
      this.clearTimer(timerState)
    })
    this.activeTimers.clear()
  }

  /**
   * タイマーをクリア
   */
  private clearTimer(timerState: TimerState): void {
    if (timerState.initialTimerId) {
      window.clearTimeout(timerState.initialTimerId)
    }
    if (timerState.timerId) {
      window.clearInterval(timerState.timerId)
    }
  }
}
