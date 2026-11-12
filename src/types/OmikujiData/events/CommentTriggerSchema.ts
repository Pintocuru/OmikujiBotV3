// src/types/OmikujiData/events/CommentTriggerSchema.ts
import { z } from 'zod'
import { normalizedArray } from '@/types/core/ParsedDefault'
import {
  AccessConditionValueSchema,
  GiftConditionValueSchema,
  GiftKindValueSchema,
  removedGiftConditions,
  type TriggerConditionType,
} from '@/types/engine'

/**
 * Comment Trigger(コメントイベントの条件)
 * - 条件の名前は全体の triggerConditions(engine/trigger)のいずれか
 * - みくじ箱の criteria(CommentCriteriaSchema)と共通のフィールドは commentConditionFields で共有する
 */
export const commentTriggerConditions = [
  'comment',
  'access',
  'gift',
  'username',
  'expression',
] as const satisfies readonly TriggerConditionType[]
export type CommentTriggerCondition = (typeof commentTriggerConditions)[number]
/** 保存データの conditions(string[])から、この版で扱える条件かどうかを判定する */
export const isCommentTriggerCondition = (value: string): value is CommentTriggerCondition =>
  (commentTriggerConditions as readonly string[]).includes(value)

/**
 * コメント条件の共通フィールド(コメントイベント / みくじ箱の criteria)
 * category は ParseIssues の分類名。配列は不正な要素だけ除外して記録する
 */
export const commentConditionFields = (category: string) => ({
  usernames: normalizedArray(z.string(), `${category}.usernames`),
  access: normalizedArray(AccessConditionValueSchema, `${category}.access`),
  gift: normalizedArray(GiftConditionValueSchema, `${category}.gift`, removedGiftConditions), // 金額の段階(有料ギフトにだけ効く)
  giftKinds: normalizedArray(GiftKindValueSchema, `${category}.giftKinds`), // ギフトの種類(空 = 種類を問わない)
  comment: normalizedArray(z.string(), `${category}.comment`), // コメント内容のパターン
  expression: z.string().catch(''),
})

export const CommentTriggerSchema = z.object({
  // 未知の条件も文字列のまま残す(判定側 checkAllTriggers が「満たさない」扱いにする)。
  // enum にすると、1つ未知の値があるだけで配列ごと [] になり、全員に発火してしまう
  conditions: z.array(z.string()).catch([]),
  ...commentConditionFields('events.comments.trigger'),
})
export type CommentTriggerType = z.infer<typeof CommentTriggerSchema>
