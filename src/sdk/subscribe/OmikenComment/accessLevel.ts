// src/sdk/subscribe/OmikenComment/accessLevel.ts
import type { UserAccessLevelType } from '@/types/OmikenComment'
import type { PlatformFields } from './platformFields'

/**
 * アクセスレベルを判定(優先度順: 配信者 > モデレーター > メンバー > 匿名 > 一般)
 */
export function determineAccessLevel(fields: PlatformFields): UserAccessLevelType {
  if (fields.isOwner) return 'owner'
  if (fields.isModerator) return 'moderator'
  if (fields.isMember || fields.subscriber === '1' || fields.premium) return 'member'
  if (fields.anonymity || fields.isAnonymous) return 'anonymous'
  return 'basic'
}

/**
 * 外部コメント(コメントテスター等)用のアクセスレベルを判定
 */
export function determineTestAccessLevel(fields: PlatformFields): UserAccessLevelType {
  if (fields.isOwner) return 'owner'
  if (fields.isMember) return 'member'
  return 'basic'
}
