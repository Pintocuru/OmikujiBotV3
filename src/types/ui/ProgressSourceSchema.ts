// src/types/ui/ProgressSourceSchema.ts
import { z } from 'zod'

/**
 * 「何で進むか」の共通スキーマ(ライバービンゴ、ブロック崩しなど、達成で進む UI で共有する)
 * - manual: 自動では進まない(クリックや LiveConsole の操作だけで進める)
 * - counter: 配信の数値(下の PROGRESS_COUNTER_KEYS)で進む
 * - variable: 評価ブロックの変数(placeholderVariable)で進む
 */

/** 配信の数値のキー */
export const PROGRESS_COUNTER_KEYS = [
  'syoken', // 初見(初コメント)の人数
  'commenter', // コメントした人数
  'totalComments', // コメント数
  'totalPrice', // ギフト金額
  'reaction', // リアクション数
  'follower', // チャンネル登録者数
  'upVote', // 高評価数
  'viewer', // 同時視聴者数
] as const
export type ProgressCounterKey = (typeof PROGRESS_COUNTER_KEYS)[number]

export const ProgressSourceSchema = z
  .discriminatedUnion('type', [
    z.object({ type: z.literal('manual') }),
    z.object({ type: z.literal('counter'), key: z.enum(PROGRESS_COUNTER_KEYS) }),
    z.object({ type: z.literal('variable'), name: z.string().max(100).default('') }),
  ])
  .default({ type: 'manual' })
  .catch({ type: 'manual' })
export type ProgressSourceType = z.infer<typeof ProgressSourceSchema>
