// src/generator/scripts/EventProcess/ServiceTriggerEvaluator.ts
import { MetaUpdateEvent } from '@/types/generator'
import { ServiceConditionType, ServiceTriggerType } from '@/types/OmikujiData/'


/**
 * 「今その状態か」で判定するトリガーか
 * lowerBound / upperBound / equal は、条件を満たしている間ずっと true になる。
 * サービスメタは 0.5 秒ごとに届くため、そのまま発火すると 0.5 秒ごとに実行されてしまう。
 * 呼び出し側で「条件を満たしていない → 満たした」の瞬間だけ発火させること。
 */
export function isStateTrigger(trigger: ServiceTriggerType): boolean {
  switch (trigger.condition) {
    case 'upVote':
      return isStateCondition(trigger.upVote)
    case 'viewer':
      return isStateCondition(trigger.viewer)
    default:
      return false
  }
}

function isStateCondition({ comparison }: ServiceConditionType): boolean {
  return comparison === 'lowerBound' || comparison === 'upperBound' || comparison === 'equal'
}

/**
 * 配信数値(サービスメタ)トリガー条件の評価
 * 設定が足りないとき、未知の condition のときは、発火させない(false)
 */
export function evaluateServiceTrigger(trigger: ServiceTriggerType, event: MetaUpdateEvent): boolean {
  switch (trigger.condition) {
    case 'upVote':
      return evaluateServiceCondition(
        trigger.upVote,
        event.current.upVote,
        event.previous?.upVote ?? 0,
        event.peakChanged.upVote
      )

    case 'viewer':
      return evaluateServiceCondition(
        trigger.viewer,
        event.current.viewer,
        event.previous?.viewer ?? 0,
        event.peakChanged.viewer
      )

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
  switch (condition.comparison) {
    case 'changed':
      return current !== previous
    case 'increased':
      return current > previous
    case 'decreased':
      return current < previous
    case 'greaterThanPeak':
      return isPeakChanged
    case 'lowerBound':
      return current >= condition.value
    case 'upperBound':
      return current <= condition.value
    case 'equal':
      return current === condition.value
    case 'loop':
      // 指定値の倍数を、増えながら超えた瞬間(例: 10 なら 9→10、19→21)
      if (!condition.value) return false
      return current > previous && Math.floor(current / condition.value) > Math.floor(previous / condition.value)
    default:
      return false
  }
}
