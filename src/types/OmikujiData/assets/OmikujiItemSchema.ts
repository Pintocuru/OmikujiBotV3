// src/types/OmikujiData/assets/OmikujiItemSchema.ts
import { z } from 'zod'
import { CriteriaThresholdSchema } from '../events/CommentCriteriaSchema'
import { PostFlowArraySchema } from './PostFlowSchema'
import { normalizedObject } from '../../core/ParsedDefault'
import { BaseSchema } from '@/types/core'

/**
 * omikujiItemKinds: おみくじアイテムの種別
 * - postFlow: BOTアクションを実行する
 * - control : 処理の流れを制御する (command: return / continue)
 */
export const omikujiItemKinds = ['postFlow', 'control'] as const

// スキーマと型の定義
export const OmikujiItemKindSchema = z.enum(omikujiItemKinds)
export type OmikujiItemKind = z.infer<typeof OmikujiItemKindSchema>

/**
 * おみくじアイテム
 */

// 優先アイテム（weight を使わない）
const OmikujiPrioritySchema = z.object({
  isPriority: z.literal(true),
  weight: z.number().min(0).default(1),
  criteria: normalizedObject(CriteriaThresholdSchema),
})

// 通常アイテム（weight を使う）
const OmikujiWeightedSchema = z.object({
  isPriority: z.literal(false).default(false),
  weight: z.number().min(0).default(1),
  criteria: CriteriaThresholdSchema.nullable().default(null),
})

// 統合
export const OmikujiLotterySchema = z.discriminatedUnion('isPriority', [OmikujiPrioritySchema, OmikujiWeightedSchema])
export type LotteryType = z.infer<typeof OmikujiLotterySchema>

/**
 * 全種別共通のベース
 */
const OmikujiItemBase = BaseSchema.extend({
  lottery: normalizedObject(OmikujiLotterySchema),
})

// BOTアクションを実行する
export const OmikujiItemPostFlowSchema = OmikujiItemBase.extend({
  kind: z.literal('postFlow').default('postFlow'), // kind 省略時は postFlow
  postFlows: PostFlowArraySchema,
  cooldownSeconds: z.number().min(0).optional(), // 設定した秒数の間、重複実行をブロックする
})
export type OmikujiItemPostFlowType = z.infer<typeof OmikujiItemPostFlowSchema>

/**
 * 処理の流れを制御する (return / continue)
 * - return  : 処理を終了する
 * - continue: 次のイベントへ処理を進める
 */
export const omikujiControlCommands = ['return', 'continue'] as const
export const OmikujiControlCommandSchema = z.enum(omikujiControlCommands)
export type OmikujiControlCommand = z.infer<typeof OmikujiControlCommandSchema>

export const OmikujiItemControlSchema = OmikujiItemBase.extend({
  kind: z.literal('control'),
  command: OmikujiControlCommandSchema.default('return').catch('return'),
  variable: z.string().default('').catch(''),
})
export type OmikujiItemControlType = z.infer<typeof OmikujiItemControlSchema>

export const OmikujiItemSchema = z.discriminatedUnion('kind', [OmikujiItemPostFlowSchema, OmikujiItemControlSchema])
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
