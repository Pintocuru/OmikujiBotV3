// src/generator/scripts/EventProcess/ServiceTriggerEvaluator.ts
import { MetaUpdateEvent } from '@/types/generator'
import { ServiceConditionType, ServiceTriggerType } from '@/types/OmikujiData/'

/**
 * 「今その状態か」で判定するトリガーか
 * lowerBound / upperBound / equal / elapsedMinutes は、条件を満たしている間ずっと true になる。
 * サービスメタは 0.5 秒ごとに届くため、そのまま発火すると 0.5 秒ごとに実行されてしまう。
 * 呼び出し側で「条件を満たしていない → 満たした」の瞬間だけ発火させること。
 */
export function isStateTrigger(trigger: ServiceTriggerType): boolean {
  switch (trigger.condition) {
    case 'elapsedMinutes':
      return true
    case 'upVote':
    case 'viewer': {
      const comparison = trigger[trigger.condition]?.comparison
      return comparison === 'lowerBound' || comparison === 'upperBound' || comparison === 'equal'
    }
    default:
      return false
  }
}

/**
 * 配信数値(サービスメタ)トリガー条件の評価
 * 設定が足りないとき、未知の condition のときは、発火させない(false)
 */
export function evaluateServiceTrigger(trigger: ServiceTriggerType, event: MetaUpdateEvent): boolean {
  switch (trigger.condition) {
    case 'upVote':
      if (!trigger.upVote) return false
      return evaluateServiceCondition(
        trigger.upVote,
        event.current.upVote,
        event.previous?.upVote ?? 0,
        event.peakChanged.upVote
      )

    case 'viewer':
      if (!trigger.viewer) return false
      return evaluateServiceCondition(
        trigger.viewer,
        event.current.viewer,
        event.previous?.viewer ?? 0,
        event.peakChanged.viewer
      )

    case 'elapsedMinutes':
      return evaluateElapsedTime(trigger.elapsedMinutes ?? 0, event.current.startTime)

    // フォロワーは、増えたときに発火する
    case 'follower':
      return event.previous !== null && event.current.follower > event.previous.follower

    default:
      return false
  }
}

/**
 * 単一条件の評価
 * peak 値ではなく peakChanged フラグを受け取る
 */
function evaluateServiceCondition(
  condition: ServiceConditionType,
  current: number,
  previous: number,
  isPeakChanged: boolean
): boolean {
  const { comparison, value } = condition

  switch (comparison) {
    case 'changed':
      return current !== previous
    case 'increased':
      return current > previous
    case 'decreased':
      return current < previous
    case 'greaterThanPeak':
      return isPeakChanged
    case 'lowerBound':
      return value !== undefined && current >= value
    case 'upperBound':
      return value !== undefined && current <= value
    case 'equal':
      return value !== undefined && current === value
    case 'loop':
      // 指定値の倍数を、増えながら超えた瞬間(例: 10 なら 9→10、19→21)
      if (!value) return false
      return current > previous && Math.floor(current / value) > Math.floor(previous / value)
    default:
      return false
  }
}

/**
 * 経過時間の評価
 */
function evaluateElapsedTime(thresholdMinutes: number, startTime: number | null): boolean {
  if (startTime == null) return false
  return Date.now() - startTime >= thresholdMinutes * 60_000
}
