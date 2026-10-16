// src/types/OmikujiData/assets/OmikujiItemSchema.ts
import { z } from 'zod'
import { CriteriaThresholdSchema } from '../events/CommentCriteriaSchema'
import { PostFlowArraySchema } from './PostFlow'
import { normalizedObject } from '../ParsedDefault'
import { BaseSchema } from '@/types/core'

/**
 * omikujiItemKinds: おみくじアイテムの種別
 * - postFlow: BOTアクションを実行する
 * - control : 処理の流れを制御する (command: return / continue / reset)
 * - log     : ユーザー状態をログとして出力する
 */
export const omikujiItemKinds = ['postFlow', 'control', 'log'] as const

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
 * 全種別共通のベース。抽選設定 (lottery) は全種別が持つ。
 *
 * 注意: discriminatedUnion の判別子 (kind) に .default() / .catch() を付けると、
 * 「kind 省略」が undefined として値を占有する。占有できるのは1種別だけなので、
 * 省略時の既定種別である postFlow のみ .default() を付け、他は素の z.literal() にする。
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

/**
 * 処理の流れを制御する (return / continue / reset)
 * - return  : 処理を終了する
 * - continue: 次のイベントへ処理を進める
 * - reset   : おみくじの抽選回数をリセットする
 */
export const omikujiControlCommands = ['return', 'continue', 'reset'] as const
export const OmikujiControlCommandSchema = z.enum(omikujiControlCommands)
export type OmikujiControlCommand = z.infer<typeof OmikujiControlCommandSchema>

export const OmikujiItemControlSchema = OmikujiItemBase.extend({
  kind: z.literal('control'),
  command: OmikujiControlCommandSchema.default('return').catch('return'),
  isCountEvent: z.boolean().default(true), // このアクションをおみくじカウントとして記録するか
  // TODO: 未実装。postFlows の kind:'variable' と同じ挙動 (評価ブロックの編集) を想定
  variable: z.string().default('').catch(''),
})

// ユーザー状態をログとして出力する
// TODO: ログを出す代わりに、評価ブロックにあるObjectまたはstringを、わんコメに投稿する機能にする
export const LOG_FORMAT_DEFAULT = '<<user>> <<score>> <<createdAt>>'
export const OmikujiItemLogSchema = OmikujiItemBase.extend({
  kind: z.literal('log'),
  // ログ1行のフォーマット文字列（使用可能: <<index>> <<user>> <<userId>> <<score>> <<item>> <<flag>> <<createdAt>>）
  logFormat: z.string().default(LOG_FORMAT_DEFAULT).catch(LOG_FORMAT_DEFAULT),
  logLimit: z.number().min(1).max(100).default(5).catch(5), // 最大出力件数（1〜100）
})

export const OmikujiItemSchema = z.discriminatedUnion('kind', [
  OmikujiItemPostFlowSchema,
  OmikujiItemControlSchema,
  OmikujiItemLogSchema,
])
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
