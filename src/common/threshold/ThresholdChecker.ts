// shared/utils/threshold/ThresholdChecker.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import {
  AccessCondition,
  CountConditionType,
  EnabledServiceType,
  GiftCondition,
  SyokenCondition,
  ThresholdCondition,
} from '../../types/Threshold/'
import { checkTimeRange } from './ThresholdHelpers'
import {
  checkSyoken,
  checkAccess,
  checkGift,
  checkCount,
  checkComment,
  checkUsername,
  checkServiceCondition,
  checkUserIdCondition,
} from './checkers'

/**
 * 複合条件チェッカー
 */
export function checkAllConditions(
  comment: Comment,
  threshold: {
    conditions: string[]
    syoken?: SyokenCondition[]
    access?: AccessCondition[]
    gift?: GiftCondition[]
    count?: CountConditionType
    comment?: string[]
    service?: EnabledServiceType[]
    userIds?: string[]
    usernames?: string[]
    timeRange?: { start: number; end: number }
  }
): boolean {
  const checkMap: Record<ThresholdCondition, () => boolean> = {
    syoken: () => checkSyoken(comment, threshold.syoken),
    access: () => checkAccess(comment, threshold.access),
    gift: () => checkGift(comment, threshold.gift),
    count: () => (threshold.count ? checkCount(comment, threshold.count) : true),
    comment: () => checkComment(comment.data.comment, threshold.comment),
    service: () => (threshold.service ? checkServiceCondition(comment, threshold.service) : true),
    userId: () => checkUserIdCondition(comment.data.userId, threshold.userIds ?? []),
    username: () => checkUsername(comment.data.name, threshold.usernames),
    timeRange: () => (threshold.timeRange ? checkTimeRange(threshold.timeRange.start, threshold.timeRange.end) : true),
  }

  // conditions配列で指定された条件のみ実行
  return threshold.conditions.every((conditionType) => {
    const checker = checkMap[conditionType as keyof typeof checkMap]
    return checker ? checker() : true
  })
}
