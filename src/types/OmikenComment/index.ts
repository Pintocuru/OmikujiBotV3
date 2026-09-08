// src/types/OmikenComment/index.ts
import { z } from 'zod'
import { idSchema } from '../core/BaseSchema'

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
 */
export const userAccessLevelsMap = {
  owner: '配信者',
  moderator: 'モデレーター',
  member: '有料メンバー',
  basic: '一般ユーザー',
  anonymous: '名無しさん',
}
export type UserAccessLevelType = keyof typeof userAccessLevelsMap
export const UserAccessLevelSchema = z
  .enum(Object.keys(userAccessLevelsMap) as [UserAccessLevelType, ...UserAccessLevelType[]])
  .default('basic')

/**
 * メタタグスキーマ
 */
export const CommentMetaSchema = z.object({
  no: z.number().default(2),
  tc: z.number().default(10),
  lc: z.number().default(2),
  isAgain: z.boolean().default(false), // 7日以降のコメントかどうか
  isExternal: z.boolean().default(false), // 外部コメントかどうか(プラットフォームでないコメント)
})
export type BaseCommentMetaType = z.infer<typeof CommentMetaSchema>

/**
 * おみくじデータ
 */
export const OmikujiMetaSchema = z.object({
  eventKey: z.string(), // おみくじイベントkey
  draws: z.number().default(1), // おみくじ回数
})
export type OmikujiMetaType = z.infer<typeof OmikujiMetaSchema>

/**
 * OmikenComment
 */
export const OmikenCommentSchema = UserNameSchema.extend({
  id: idSchema,
  accessLevel: UserAccessLevelSchema,
  giftPrice: z.number().nullable().default(null),
  comment: z.string(),
  meta: CommentMetaSchema.default(CommentMetaSchema.parse({})),
  omikuji: OmikujiMetaSchema.optional(),
})
export type OmikenCommentType = z.infer<typeof OmikenCommentSchema>
