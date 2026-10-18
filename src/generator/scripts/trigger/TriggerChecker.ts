// src/generator/scripts/trigger/TriggerChecker.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import {
  AccessConditionType,
  CountConditionType,
  GiftConditionType,
  SyokenConditionType,
  TriggerConditionType,
} from '@/types/engine/trigger'
import { checkAccess, checkCount, checkGift, checkSyoken } from './checkers/UserCheckersTrigger'
import { checkComment } from './checkers/ContentCheckers'
import { checkUserIdCondition, checkUsername } from './checkers/UserCheckers'
import { checkTimeRange } from './checkers/CheckTimeRange'
import { checkExpression } from './checkers/ExpressionChecker'

/**
 * 複合条件チェッカー
 */
export function checkAllTriggers(
  omiken: OmikenCommentType,
  trigger: {
    conditions: string[]
    syoken?: SyokenConditionType[]
    access?: AccessConditionType[]
    gift?: GiftConditionType[]
    count?: CountConditionType
    comment?: string[]
    userIds?: string[]
    usernames?: string[]
    timeRange?: { start: number; end: number }
    expression?: string
  }
): boolean {
  const checkMap: Record<TriggerConditionType, () => boolean> = {
    syoken: () => checkSyoken(omiken, trigger.syoken),
    access: () => checkAccess(omiken, trigger.access),
    gift: () => checkGift(omiken, trigger.gift),
    count: () => checkCount(omiken, trigger.count),
    service: () => true,
    comment: () => checkComment(omiken.comment, trigger.comment),
    userId: () => checkUserIdCondition(omiken.userId, trigger.userIds ?? []),
    username: () => checkUsername(omiken.userName, trigger.usernames),
    timeRange: () => (trigger.timeRange ? checkTimeRange(trigger.timeRange.start, trigger.timeRange.end) : true),
    // 判定式: 評価できない場合は false
    expression: () => checkExpression(omiken, trigger.expression),
  }

  // conditions配列で指定された条件のみ実行
  return trigger.conditions.every((conditionType) => {
    const checker = checkMap[conditionType as keyof typeof checkMap]
    return checker ? checker() : true
  })
}
