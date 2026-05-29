// shared/utils/threshold/checkers/UserCheckers.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { AccessCondition, SyokenCondition } from '../../../types/Threshold/'
import { getCommentMeta, isCommentTester } from '../ThresholdHelpers'

/**
 * 初見・久しぶりのチェック
 */
export function checkSyoken(comment: Comment, syoken: SyokenCondition[] = []): boolean {
  if (!syoken.length) return true
  const { isFirstTime = false } = comment.data
  const { interval, tc } = getCommentMeta(comment.meta)
  const isTester = isCommentTester(comment)

  const isSyoken = tc === 1
  const day7 = 7 * 24 * 60 * 60 * 1000
  const isAgain = interval > day7 || (isTester && isFirstTime && tc === 2)
  const isFirstVisit = (!isSyoken && !isAgain && isFirstTime) || (isTester && !isFirstTime && tc === 2)

  const conditions = { syoken: isSyoken, again: isAgain, firstVisit: isFirstVisit }
  return syoken.some((condition) => conditions[condition] ?? false)
}

/**
 * ユーザー役職チェック
 */
export function checkAccess(comment: Comment, access: AccessCondition[] = []): boolean {
  if (!access.length) return true
  if (!comment.data) return false

  const { isOwner, isModerator, isMember, subscriber, premium } = comment.data as any
  const userRoles: AccessCondition[] = []

  if (!isOwner && !isModerator && !isMember && !subscriber && !premium) userRoles.push('basic')
  if (isOwner) userRoles.push('owner')
  if (isModerator) userRoles.push('moderator')
  if (isMember) userRoles.push('member')
  if (subscriber === '1') userRoles.push('subscriber')
  if (premium) userRoles.push('premium')

  return access.some((required) => userRoles.includes(required))
}

/**
 * ユーザーID条件チェック（許可/禁止リスト対応）
 */
export function checkUserIdCondition(userId: string, userIds: string[] = []): boolean {
  if (!userIds.length) return true
  if (!userId) return false

  const allowedIds = userIds.filter((id) => !id.startsWith('!'))
  const disallowedIds = userIds.filter((id) => id.startsWith('!')).map((id) => id.substring(1))

  // 禁止リストチェック
  if (disallowedIds.includes(userId)) return false

  // 許可リストが空またはユーザーが含まれている
  return !allowedIds.length || allowedIds.includes(userId)
}

/**
 * ユーザー名パターンチェック
 */
export function checkUsername(name: string, patterns: string[] = []): boolean {
  if (!patterns.length) return true
  if (!name) return false

  return patterns.some((pattern) => {
    try {
      return new RegExp(pattern).test(name)
    } catch (e) {
      console.warn(`Invalid username regex pattern: ${pattern}`, e)
      return false
    }
  })
}
