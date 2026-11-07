// src/types/OmikujiData/events/CommentTriggerSchema.ts
import { z } from 'zod'
import { normalizedArray } from '@/types/core/ParsedDefault'
import { AccessConditionValueSchema, GiftConditionValueSchema, type TriggerConditionType } from '@/types/engine'

/**
 * Comment Trigger(コメントイベントの条件)
 * - 条件の名前は全体の triggerConditions(engine/trigger)のいずれか
 * - みくじ箱の criteria(CommentCriteriaSchema)と共通のフィールドは commentConditionFields で共有する
 */
export const commentTriggerConditions = ['comment', 'access', 'gift', 'username', 'expression'] as const satisfies readonly TriggerConditionType[]
export type CommentTriggerCondition = (typeof commentTriggerConditions)[number]

/**
 * コメント条件の共通フィールド(コメントイベント / みくじ箱の criteria)
 * category は ParseIssues の分類名。配列は不正な要素だけ除外して記録する
 */
export const commentConditionFields = (category: string) => ({
  usernames: normalizedArray(z.string(), `${category}.usernames`),
  access: normalizedArray(AccessConditionValueSchema, `${category}.access`),
  gift: normalizedArray(GiftConditionValueSchema, `${category}.gift`),
  comment: normalizedArray(z.string(), `${category}.comment`), // コメント内容のパターン
  expression: z.string().catch(''),
})

export const CommentTriggerSchema = z.object({
  conditions: z.array(z.enum(commentTriggerConditions)).catch([]),
  ...commentConditionFields('events.comments.trigger'),
})
export type CommentTriggerType = z.infer<typeof CommentTriggerSchema>
