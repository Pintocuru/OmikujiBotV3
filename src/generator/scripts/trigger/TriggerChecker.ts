// src/generator/scripts/trigger/TriggerChecker.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import {
  AccessConditionTrigger,
  CountConditionTriggerType,
  GiftCondition,
  SyokenCondition,
  TriggerCondition,
} from '@/types/engine/trigger'
import {
  checkAccessTrigger,
  checkCountTrigger,
  checkGiftTrigger,
  checkSyokenTrigger,
} from './checkers/UserCheckersTrigger'
import { checkComment } from './checkers/ContentCheckers'
import { checkUserIdCondition, checkUsername } from './checkers/UserCheckers'
import { checkTimeRange } from './checkers/CheckTimeRange'

/**
 * 複合条件チェッカー
 */
export function checkAllTriggers(
  omiken: OmikenCommentType,
  threshold: {
    conditions: string[]
    syoken?: SyokenCondition[]
    access?: AccessConditionTrigger[]
    gift?: GiftCondition[]
    count?: CountConditionTriggerType
    comment?: string[]
    userIds?: string[]
    usernames?: string[]
    timeRange?: { start: number; end: number }
  }
): boolean {
  const checkMap: Record<TriggerCondition, () => boolean> = {
    syoken: () => checkSyokenTrigger(omiken, threshold.syoken),
    access: () => checkAccessTrigger(omiken, threshold.access),
    gift: () => checkGiftTrigger(omiken, threshold.gift),
    count: () => checkCountTrigger(omiken, threshold.count),
    service: () => true, // TODO:実装
    comment: () => checkComment(omiken.comment, threshold.comment),
    userId: () => checkUserIdCondition(omiken.userId, threshold.userIds ?? []),
    username: () => checkUsername(omiken.userName, threshold.usernames),
    timeRange: () => (threshold.timeRange ? checkTimeRange(threshold.timeRange.start, threshold.timeRange.end) : true),
  }

  // conditions配列で指定された条件のみ実行
  return threshold.conditions.every((conditionType) => {
    const checker = checkMap[conditionType as keyof typeof checkMap]
    return checker ? checker() : true
  })
}
