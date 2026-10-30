// src/types/OmikujiData/assets/OmikujiItemSchema.ts
import { z } from 'zod'
import { CriteriaThresholdSchema } from '../events/CommentCriteriaSchema'
import { normalizedObject } from '../../core/ParsedDefault'
import { BaseSchema } from '@/types/core'

/**
 * omikujiItemKinds: おみくじアイテムの種別
 * - steps: シナリオ(assets.scenarios)を stepKey で指定して実行する
 * - control : 処理の流れを制御する (command: return / continue)
 */
const omikujiItemKinds = ['steps', 'control'] as const
const _OmikujiItemKindSchema = z.enum(omikujiItemKinds)
export type OmikujiItemKind = z.infer<typeof _OmikujiItemKindSchema>

/**
 * おみくじアイテム
 */

// 優先アイテム（weight を使わない）
const OmikujiPrioritySchema = z.object({
  isPriority: z.literal(true),
  weight: z.number().min(0).default(1),
  criteria: normalizedObject(CriteriaThresholdSchema, 'assets.mikuji.items.criteria'),
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
  lottery: normalizedObject(OmikujiLotterySchema, 'assets.mikuji.items.lottery'),
})

// シナリオを実行する
export const OmikujiItemStepsSchema = OmikujiItemBase.extend({
  kind: z.literal('steps').default('steps'), // kind 省略時は steps
  stepKey: z.string().default('').catch(''),
  cooldownSeconds: z.number().min(0).optional(), // 設定した秒数の間、重複実行をブロックする
})
export type OmikujiItemStepsType = z.infer<typeof OmikujiItemStepsSchema>

/**
 * 処理の流れを制御する (return / continue)
 * - return  : 処理を終了する
 * - continue: 次のイベントへ処理を進める
 */
const omikujiControlCommands = ['return', 'continue'] as const
const OmikujiControlCommandSchema = z.enum(omikujiControlCommands)
export type OmikujiControlCommand = z.infer<typeof OmikujiControlCommandSchema>

export const OmikujiItemControlSchema = OmikujiItemBase.extend({
  kind: z.literal('control'),
  command: OmikujiControlCommandSchema.default('return').catch('return'),
  variable: z.string().default('').catch(''),
})
export type OmikujiItemControlType = z.infer<typeof OmikujiItemControlSchema>

export const OmikujiItemSchema = z.discriminatedUnion('kind', [OmikujiItemStepsSchema, OmikujiItemControlSchema])
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
