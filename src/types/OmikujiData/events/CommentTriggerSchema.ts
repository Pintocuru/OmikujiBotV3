// src/types/OmikujiData/events/CommentTriggerSchema.ts
import { z } from 'zod'
import { AccessConditionSchema, GiftConditionSchema } from '@/types/engine'

/**
 * Comment Trigger
 */
export const commentTriggerCondition = ['comment', 'access', 'gift', 'username', 'expression'] as const
export type CommentTriggerCondition = (typeof commentTriggerCondition)[number]

export const CommentTriggerSchema = z.object({
  conditions: z.array(z.enum(commentTriggerCondition)).catch([]),
  userName: z.array(z.string()).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  comment: z.array(z.string()).catch([]),
  // 判定式 (例: <<lc>> > 20)。true になったときだけ発動
  expression: z.string().catch(''),
})
export type CommentTriggerType = z.infer<typeof CommentTriggerSchema>
