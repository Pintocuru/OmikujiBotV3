// src/generator/scripts/EventProcess/ReactionTriggerEvaluator.ts
import type { ReactionStatsManagerType } from '@/types/generator'
import type { ReactionTriggerType } from '@/types/OmikujiData'

/**
 * トリガーの対象になっているリアクションの累計
 * milestone / equal の「前回の累計」を記録するために、呼び出し側が使う。
 */
export function getTargetTotal(trigger: ReactionTriggerType, stats: ReactionStatsManagerType): number {
  if (!trigger.reactions || trigger.reactions.length === 0) return 0
  return stats.getTotal(trigger.reactions)
}

/**
 * リアクションのトリガーを評価
 * @param previousTotal 前回の評価時点での、対象リアクションの累計(milestone / equal で使用)
 *   他の種類のリアクションだけが届いたときに、同じ累計で何度も発火しないために必要。
 */
export function evaluateReactionTrigger(
  trigger: ReactionTriggerType,
  stats: ReactionStatsManagerType,
  previousTotal: number
): boolean {
  const { reactions, comparison, value, triggerLevel } = trigger

  if (!reactions || reactions.length === 0) return false

  const total = getTargetTotal(trigger, stats)

  switch (comparison) {
    case 'milestone':
      return evaluateMilestone(total, previousTotal, value)

    case 'equal':
      return evaluateEqual(total, previousTotal, value)

    case 'burstReach':
      return evaluateBurstReach(triggerLevel, stats)

    case 'burstSustain':
      return evaluateBurstSustain(triggerLevel, value, stats)

    case 'burstDrop':
      return evaluateBurstDrop(triggerLevel, stats)

    default:
      return false
  }
}

/**
 * milestone: 累計がvalueの倍数を超えるたびに発火
 * 一度に複数増えて倍数をまたいだ場合も、1回発火する。value=0 は無効
 */
function evaluateMilestone(total: number, previousTotal: number, value: number): boolean {
  if (value <= 0) return false
  return Math.floor(total / value) > Math.floor(previousTotal / value)
}

/**
 * equal: 累計がvalueに達した瞬間に1回だけ発火
 * 一度に複数増えて value をまたいだ場合も、1回発火する
 */
function evaluateEqual(total: number, previousTotal: number, value: number): boolean {
  return previousTotal < value && total >= value
}

/**
 * burstReach: 指定レベル以上に到達した瞬間に1回だけ発火
 */
function evaluateBurstReach(triggerLevel: number, stats: ReactionStatsManagerType): boolean {
  const burst = stats.getBurstState()
  if (burst.level >= triggerLevel && burst.reachedLevel !== null && burst.reachedLevel >= triggerLevel) {
    stats.consumeReachedLevel()
    return true
  }
  return false
}

/**
 * burstSustain: 指定レベル以上の間、value回押されるたびに発火
 * value=0 または value=1 は押されるたびに毎回発火
 */
function evaluateBurstSustain(triggerLevel: number, value: number, stats: ReactionStatsManagerType): boolean {
  const burst = stats.getBurstState()
  if (burst.level < triggerLevel) return false
  if (value <= 1) return true
  if (burst.sustainCount >= value) {
    stats.resetSustainCount()
    return true
  }
  return false
}

/**
 * burstDrop: 指定レベル以下に下がった瞬間に1回だけ発火
 */
function evaluateBurstDrop(triggerLevel: number, stats: ReactionStatsManagerType): boolean {
  const burst = stats.getBurstState()
  if (burst.droppedLevel !== null && burst.droppedLevel <= triggerLevel) {
    stats.consumeDroppedLevel()
    return true
  }
  return false
}
