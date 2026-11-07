// src/types/OmikenComment/index.ts
import { z } from 'zod'
import { idSchema } from '@/types/core/BaseSchema'
import { AccessConditionValueSchema, GiftKindValueSchema, type AccessConditionType } from '@/types/engine'

/**
 * UserName
 */
export const UserNameSchema = z.object({
  userName: z.string().default('名無しさん').catch('名無しさん'), // 名前
  userId: z.string().default(''), // ユーザーID
  profileImage: z.string().default(''), // プロフィール画像
  timestamp: z.number().default(() => Date.now()), // タイムスタンプ
})
export type UserNameType = z.infer<typeof UserNameSchema>

/**
 * アクセスレベル(ユーザーの属性)
 * - 値は、判定条件の access(engine/trigger の accessConditions)と同じ
 */
export type UserAccessLevelType = AccessConditionType
export const UserAccessLevelSchema = AccessConditionValueSchema.default('basic')

/**
 * メタタグスキーマ(わんコメのコメントの meta)
 * - no / tc / lc は必ず指定する(欠けたコメントを 2 回目・10 件目として扱わないため、既定値は持たない)
 *   わんコメが meta を付けないときは、OmikenCommentProcessor が 0(不明)として渡す
 */
export const CommentMetaSchema = z.object({
  no: z.number(), // この枠での個人のコメント数(1 なら今回が初コメント)
  tc: z.number(), // 個人コメント数(総数)
  lc: z.number(), // 配信枠のコメント数
  isAgain: z.boolean().default(false), // 7日以降のコメントかどうか
  isExternal: z.boolean().default(false), // 外部コメントかどうか(プラットフォームでないコメント)
})
export type CommentMetaType = z.infer<typeof CommentMetaSchema>

/**
 * OmikenComment
 */
export const OmikenCommentSchema = UserNameSchema.extend({
  id: idSchema,
  accessLevel: UserAccessLevelSchema,
  giftPrice: z.number().nullable().default(null), // 金額(円に概算)。ギフトでなければ null、無料・メンバー/サブスクは 0
  giftKind: GiftKindValueSchema.nullable().default(null), // ギフトの種類。ギフトでなければ null
  giftCount: z.number().default(0), // ギフトの個数。ギフトでなければ 0
  comment: z.string(),
  meta: CommentMetaSchema,
})
export type OmikenCommentType = z.infer<typeof OmikenCommentSchema>
