// src/types/OmikujiData/events/CommentTriggerSchema.ts
import { z } from 'zod'
import { AccessConditionSchema, GiftConditionSchema } from '../../trigger'

/**
 * Comment Trigger
 */
export const commentTriggerCondition = ['comment', 'access', 'gift', 'username'] as const
export type CommentTriggerCondition = (typeof commentTriggerCondition)[number]

export const CommentTriggerSchema = z.object({
  conditions: z.array(z.enum(commentTriggerCondition)).catch([]),
  userName: z.array(z.string()).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  comment: z.array(z.string()).catch([]),
})
export type CommentTriggerType = z.infer<typeof CommentTriggerSchema>
