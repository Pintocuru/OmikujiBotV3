// src/types/subscribe/SendCommentSchema.ts
// わんコメにpostする際の型定義
import { z } from 'zod'
import { idSchema } from '../core/BaseSchema'

/**
 * Service スキーマ
 * @onecomme.com/onesdk/types/Service
 */
const ServicePickSchema = z.object({
  id: z.string().refine((val) => val.trim() !== '', {
    message: '該当する枠のIDが存在しません',
  }),
})

/**
 * BaseResponse スキーマ(抜粋) + color
 * @onecomme.com/onesdk/types/BaseResponse
 * @onecomme.com/onesdk/types/Comment
 */

// CommentBadgeSchema
export const CommentBadgeSchema = z.object({
  url: z.string(),
  label: z.string(),
})

export const CommentPickSchema = z.object({
  id: idSchema,
  userId: z.string().default('test'),
  name: z.string().default('error'),
  nickname: z.string().optional(),
  comment: z.string(),
  profileImage: z.string().optional(),
  badges: z.array(CommentBadgeSchema).optional(),
})

// SendCommentType のスキーマ
export const SendCommentSchema = z.object({
  service: ServicePickSchema,
  comment: CommentPickSchema,
})
export type SendCommentType = z.infer<typeof SendCommentSchema>

/**
 * SendTestCommentSchema
 * platform は Youtube 固定
 */
export const SendTestCommentSchema = z.object({
  platform: z.literal('youtube').default('youtube'), // プラットフォーム（youtube）
  hasGift: z.boolean().default(false), // ギフトなし
  unit: z.string().default(''), // 通貨単位なし
  price: z.number().default(1000), // デフォルト価格
  giftType: z.string().default('none'), // ギフトタイプ
  newComment: z.boolean().default(false), // 新規コメントフラグ
  repeater: z.boolean().default(false), // リピーターフラグ
  subscribe: z.boolean().default(false), // 購読者フラグ
  speech: z.boolean().default(true), // 音声読み上げ有効
  username: z.string().default('error'), // 指定されたユーザー名
  comment: z.string(), // 投稿内容
})
export type SendTestCommentType = z.infer<typeof SendTestCommentSchema>
