// src/types/engine/placeholder/DefaultPlaceholders.ts
import z from 'zod'

/**
 * プレースホルダー一覧
 * slot:'comment'（コメントイベントのみ）と slot:'event'（全体）
 */
export const defaultPlaceholderLabel = [
  'viewer',
  'upVote',
  'follower',
  'lc',
  'commenter',
  'syoken',
  'user',
  'userId',
  'price',
  'giftCount',
  'tc',
] as const

export type DefaultPlaceholders = (typeof defaultPlaceholderLabel)[number]

export const defaultPlaceholders = [...defaultPlaceholderLabel] as DefaultPlaceholders[]

/**
 * Meta プレースホルダー
 */
export const DefaultPlaceholdersMetaSchema = z.object({
  viewer: z.coerce.number().default(0).catch(0),
  upVote: z.coerce.number().default(0).catch(0),
  follower: z.coerce.number().default(0).catch(0),
  commenter: z.coerce.number().default(0).catch(0),
  syoken: z.coerce.number().default(0).catch(0),
})

export const DefaultPlaceholdersCommentSchema = z.object({
  user: z.string().default('Test User').catch('Test User'),
  userId: z.string().default('test').catch('test'),
  price: z.coerce.number().default(0).catch(0),
  giftCount: z.coerce.number().default(0).catch(0),
  tc: z.coerce.number().default(0).catch(0),
  lc: z.coerce.number().default(0).catch(0),
  ...DefaultPlaceholdersMetaSchema.shape,
})
