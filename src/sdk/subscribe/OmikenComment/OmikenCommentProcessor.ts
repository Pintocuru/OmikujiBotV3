// src/sdk/subscribe/OmikenComment/OmikenCommentProcessor.ts
import type { z } from 'zod'
import { OmikenCommentSchema } from '@/types/OmikenComment'
import type { OmikenCommentType } from '@/types/OmikenComment'
import type { Comment } from '@onecomme.com/onesdk/types/Comment'
import { determineAccessLevel, determineTestAccessLevel } from './accessLevel'
import { createMeta, createTestMeta } from './commentMeta'
import { getGiftInfo } from './giftInfo'
import { normalizeUserId } from './normalizeUserId'
import { platformFields } from './platformFields'

// 検証前(スキーマの input)の型
type OmikenCommentInput = z.input<typeof OmikenCommentSchema>

/**
 * コメントテスター判定
 */
const isCommentTester = (comment: Comment): boolean => comment.id === 'COMMENT_TESTER'

/**
 * 処理できる形のコメントか(data がオブジェクトであること)
 */
function isComment(value: unknown): value is Comment {
  if (typeof value !== 'object' || value === null) return false
  const data = (value as { data?: unknown }).data
  return typeof data === 'object' && data !== null
}

/**
 * 1件のコメントを加工する。失敗したら警告を出して null を返す(例外は投げない)
 */
function toOmikenComment(comment: unknown): OmikenCommentType | null {
  try {
    if (!isComment(comment)) {
      console.warn('[processOmikenComment] 不正な入力:', comment)
      return null
    }

    const result = OmikenCommentSchema.safeParse(buildCommentPayload(comment))
    if (!result.success) {
      console.warn('[processOmikenComment] パース失敗 (スキップ):', result.error.flatten(), '元データ:', comment)
      return null
    }
    return result.data
  } catch (error) {
    console.warn('[processOmikenComment] 処理中にエラー (スキップ):', error, '元データ:', comment)
    return null
  }
}

/**
 * わんコメのコメントをおみくじBOT用コメントに加工
 * コメントリストから処理可能なコメントをすべて返す(1件失敗しても他のコメントは処理を続ける)
 */
export function processOmikenComments(comments: Comment[]): OmikenCommentType[] {
  return comments.flatMap((comment) => {
    const result = toOmikenComment(comment)
    return result ? [result] : []
  })
}

/**
 * 単一のコメントを処理
 */
export function processOmikenComment(comment: unknown): OmikenCommentType | null {
  return toOmikenComment(comment)
}

/**
 * わんコメのコメントを、OmikenComment(検証前)に変換
 */
function buildCommentPayload(comment: Comment): OmikenCommentInput {
  const { data, meta } = comment
  const fields = platformFields(data)
  const isTester = isCommentTester(comment)
  // 各プラットフォームのコメントは external にならない(コメントテスターや外部APIからの投稿だけ)
  const isExternal = comment.service === 'external'

  return {
    id: data.id,
    userId: normalizeUserId(comment.service, data.userId),
    userName: data.displayName ?? data.nickname ?? data.name,
    timestamp: Date.parse(data.timestamp),
    profileImage: data.profileImage,
    accessLevel: isExternal ? determineTestAccessLevel(fields) : determineAccessLevel(fields),
    ...getGiftInfo(fields),
    // YouTube のステッカー等が含む img タグは、文字列として表示されないよう除去する
    comment: data.comment.replace(/<img\\b[^>]*\\/?>/gi, ''),
    meta: isTester ? createTestMeta(data.isFirstTime, meta) : createMeta(isExternal, meta),
  }
}
