// shared/sdk/subscribe/OmikenComment/OmikenCommentProcessor.ts
import {
  CommentMetaSchema,
  OmikenCommentSchema,
  OmikenCommentType,
  UserAccessLevelType,
  BaseCommentMetaType,
} from '../../../types/OmikenComment/OmikenCommentSchema'
import { convertToJPY, isCommentTester } from '../../../utils/threshold/ThresholdHelpers'
import { BaseCommentMeta, Comment } from '@onecomme.com/onesdk/types/Comment'

// 定数
const DAY_7_MS = 7 * 24 * 60 * 60 * 1000

/**
 * わんコメのコメントをおみくじBOT用コメントに加工
 * コメントリストから処理可能なコメントをすべて返す
 */
export function processOmikenComments(comments: Comment[]): OmikenCommentType[] {
  const results: OmikenCommentType[] = []

  for (const comment of comments) {
    const result = OmikenCommentSchema.safeParse(buildCommentPayload(comment))

    if (result.success) {
      results.push(result.data)
    } else {
      // 1件失敗しても他コメントは処理継続、ただしログに残す
      console.warn('[processOmikenComments] パース失敗 (スキップ):', result.error.flatten(), '元データ:', comment)
    }
  }

  return results
}

/**
 * 単一のコメントを処理
 */
export function processOmikenComment(comment: unknown): OmikenCommentType | null {
  if (!comment || typeof comment !== 'object') {
    console.warn('[processOmikenComment] 不正な入力:', comment)
    return null
  }

  const result = OmikenCommentSchema.safeParse(buildCommentPayload(comment as Comment))

  if (!result.success) {
    console.warn('[processOmikenComment] パース失敗:', result.error.flatten(), '元データ:', comment)
    return null
  }

  return result.data
}

/**
 * コメントを処理してOmikenCommentに変換
 */
function buildCommentPayload(comment: Comment): OmikenCommentType {
  const { data, meta } = comment
  const isTester = isCommentTester(comment)
  const isExternal = comment.service === 'external'

  return {
    id: data.id,
    userId: data.userId,
    userName: data.displayName ?? data.nickname ?? data.name,
    timestamp: Date.parse(data.timestamp),
    profileImage: data.profileImage,
    accessLevel: isExternal ? determineTestAccessLevel(data) : determineAccessLevel(data),
    giftPrice: getGiftPrice(data),
    comment: data.comment,
    meta: isTester ? createTestMeta(comment.data.isFirstTime, meta) : createMeta(isExternal, meta),
  }
}

/**
 * ユーザーの役職を取得
 */
function getUserRoles(data: any): Set<string> {
  if (!data) return new Set(['basic'])

  const roles = new Set<string>()
  const { isOwner, isModerator, isMember, subscriber, premium } = data

  if (isOwner) roles.add('owner')
  if (isModerator) roles.add('moderator')
  if (isMember || subscriber === '1' || premium) roles.add('member')
  if (roles.size === 0) roles.add('basic')

  return roles
}

/**
 * アクセスレベルを判定（優先度順）
 */
function determineAccessLevel(data: any): UserAccessLevelType {
  const roles = getUserRoles(data)

  // 優先度の高い順にチェック
  if (roles.has('owner')) return 'owner'
  if (roles.has('moderator')) return 'moderator'
  if (roles.has('member')) return 'member'
  if (roles.has('anonymity')) return 'anonymous'
  return 'basic'
}

/**
 * テストコメント用のアクセスレベルを判定
 */
function determineTestAccessLevel(data: any): UserAccessLevelType {
  if (data.isOwner) return 'owner'
  if (data.isMember) return 'member'
  return 'basic'
}

/**
 * メタ情報を作成
 */
function createMeta(isExternal: boolean, meta?: BaseCommentMeta): BaseCommentMetaType {
  return CommentMetaSchema.parse({
    no: meta?.no,
    tc: meta?.tc,
    lc: meta?.lc,
    isAgain: (meta?.interval ?? 0) > DAY_7_MS,
    isExternal,
  })
}

/**
 * コメントテスター用のメタ情報を作成
 */
function createTestMeta(isFirstTime?: boolean, meta?: BaseCommentMeta): BaseCommentMetaType {
  return CommentMetaSchema.parse({
    no: !isFirstTime && meta?.tc === 2 ? 1 : randomInRange(3, 1000),
    tc: isFirstTime && meta?.tc === 1 ? 1 : randomInRange(6, 5000),
    lc: meta?.lc,
    isAgain: isFirstTime && meta?.tc === 2,
    isExternal: true,
  })
}
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * ギフトの価格を取得
 */
function getGiftPrice(data: any): number | null {
  if (!data.hasGift) return null
  return convertToJPY(data.price ?? 0, data.unit)
}
