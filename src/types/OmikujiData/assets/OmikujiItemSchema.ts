// src/types/OmikujiData/OmikujiSchema.ts
import { z } from 'zod'
import { CriteriaThresholdSchema } from '../events/CommentCriteriaSchema'
import { PostFlowArraySchema } from './PostFlow'
import { normalizedObject } from '../ParsedDefault'
import { BaseSchema } from '../../core/BaseSchema'

/**
 * omikujiItemKinds カテゴリのUI表示情報
 */
export const omikujiItemKinds = ['postFlow', 'return', 'continue', 'reset', 'log'] as const

// スキーマと型の定義
export const OmikujiItemKindSchema = z.enum(omikujiItemKinds)
export type OmikujiItemKind = z.infer<typeof OmikujiItemKindSchema>

/**
 * おみくじアイテム
 */

// 優先アイテム（weight を使わない）
const OmikujiPrioritySchema = z.object({
  isPriority: z.literal(true),
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

/**
 * kind フィールドの定義を共通化するヘルパー。
 * `.default(x).catch(x)` の x のタイポ・ズレを防ぐ。
 */
const kindSchema = <K extends OmikujiItemKind>(kind: K) => OmikujiItemKindSchema.default(kind).catch(kind)

/**
 * 「おみくじカウントとして記録するか」を持つ omikujiItem 種別の共通ベース。
 * return / continue / reset の3種で共有する。
 */
const OmikujiItemCountableBase = BaseSchema.extend({
  isCountEvent: z.boolean().default(true), // このアクションをおみくじカウントとして記録するか
  lottery: normalizedObject(OmikujiLotterySchema),
})

// BOTアクションを実行する
export const OmikujiItemPostFlowSchema = BaseSchema.extend({
  kind: kindSchema('postFlow'),
  postFlows: PostFlowArraySchema,
  cooldownSeconds: z.number().min(0).optional(), // 設定した秒数の間、重複実行をブロックする
  lottery: normalizedObject(OmikujiLotterySchema),
})

// 処理を終了する
export const OmikujiItemReturnSchema = OmikujiItemCountableBase.extend({
  kind: kindSchema('return'),
})

// 次のイベントへ処理を進める
export const OmikujiItemContinueSchema = OmikujiItemCountableBase.extend({
  kind: kindSchema('continue'),
})

// おみくじの抽選回数をリセットする
export const OmikujiItemResetSchema = OmikujiItemCountableBase.extend({
  kind: kindSchema('reset'),
})

// ユーザー状態をログとして出力する
export const LOG_FORMAT_DEFAULT = '<<user>> <<score>> <<createdAt>>'
export const OmikujiItemLogSchema = BaseSchema.extend({
  kind: kindSchema('log'),
  // ログ1行のフォーマット文字列（使用可能: <<index>> <<user>> <<userId>> <<score>> <<item>> <<flag>> <<createdAt>>）
  logFormat: z.string().default(LOG_FORMAT_DEFAULT).catch(LOG_FORMAT_DEFAULT),
  logLimit: z.number().min(1).max(100).default(5).catch(5), // 最大出力件数（1〜100）
  omikuji: normalizedObject(OmikujiLotterySchema),
})

export const OmikujiItemSchema = z.discriminatedUnion('kind', [
  OmikujiItemPostFlowSchema,
  OmikujiItemReturnSchema,
  OmikujiItemContinueSchema,
  OmikujiItemResetSchema,
  OmikujiItemLogSchema,
])
export type OmikujiItemType = z.infer<typeof OmikujiItemSchema>
