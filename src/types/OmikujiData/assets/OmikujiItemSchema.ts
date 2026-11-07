// src/types/OmikujiData/assets/OmikujiItemSchema.ts
import { z } from 'zod'
import { CriteriaThresholdSchema } from '../events/CommentCriteriaSchema'
import { normalizedObject } from '@/types/core/ParsedDefault'
import { BaseSchema } from '@/types/core'

/**
 * omikujiItemKinds: おみくじアイテムの種別
 * - scenario: シナリオ(assets.scenarios)を scenarioKey で指定して実行する
 * - control : 処理の流れを制御する (command: return / continue)
 */
export const omikujiItemKinds = ['scenario', 'control'] as const
export type OmikujiItemKind = (typeof omikujiItemKinds)[number]

/**
 * おみくじアイテム
 */

// 優先アイテム（抽選では weight を使わない。通常アイテムに戻したときのため値は保持する）
const OmikujiPrioritySchema = z.object({
  isPriority: z.literal(true),
  weight: z.number().min(0).default(1).catch(1),
  criteria: normalizedObject(CriteriaThresholdSchema, 'assets.mikuji.items.criteria'),
})

// 通常アイテム（weight を使う）
const OmikujiWeightedSchema = z.object({
  isPriority: z.literal(false).default(false),
  weight: z.number().min(0).default(1).catch(1),
  criteria: CriteriaThresholdSchema.nullable().default(null),
})

// 統合
export const OmikujiLotterySchema = z.discriminatedUnion('isPriority', [OmikujiPrioritySchema, OmikujiWeightedSchema])
export type OmikujiLotteryType = z.infer<typeof OmikujiLotterySchema>

/**
 * 全種別共通のベース
 */
const OmikujiItemBase = BaseSchema.extend({
  lottery: normalizedObject(OmikujiLotterySchema, 'assets.mikuji.items.lottery'),
})

// シナリオを実行する
export const OmikujiItemStepsSchema = OmikujiItemBase.extend({
  kind: z.literal('scenario').default('scenario'), // kind 省略時は scenario
  scenarioKey: z.string().default('').catch(''), // 実行するシナリオ(assets.scenarios)のキー
  cooldownSeconds: z.number().optional().catch(undefined), // 直前に実行されたシナリオの値を基準に、一定時間の後続実行を制限する (負数可。詳細は CooldownGate.ts)
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
  variable: z.string().default('').catch(''), // 評価ブロック {{ }} を含む文字列(処理の前に評価する)
})
export type OmikujiItemControlType = z.infer<typeof OmikujiItemControlSchema>

export const OmikujiItemSchema = z.discriminatedUnion('kind', [OmikujiItemStepsSchema, OmikujiItemControlSchema])
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
