// src/types/ui/game/DeadAirSchema.ts
import { z } from 'zod'

// DeadAir のコンポーネントセット
export const deadAirComponentSets = {
  standard: ['bomb'],
} as const

export type DeadAirComponentSets = typeof deadAirComponentSets
export type DeadAirComponentSet = keyof DeadAirComponentSets

// セット別の ID 型
export type DeadAirComponentOf<S extends DeadAirComponentSet> = DeadAirComponentSets[S][number]

// 全 ID
export type DeadAirComponent = DeadAirComponentOf<DeadAirComponentSet>

/** 既定の表示コンポーネント ID(スキーマ・検証・エディターで共有する 1か所の定数) */
export const DEAD_AIR_DEFAULT_COMPONENT = 'bomb'

/**
 * useStreamCounters が最初から持っているカウンターのキー。
 * これ以外のキーは「変数カウンター」として useStreamCounters に渡す。
 * (共通の定数が別にあれば、そちらに差し替える)
 */
export const DEAD_AIR_BUILTIN_COUNTER_KEYS = [
  'upVote',
  'viewer',
  'follower',
  'syoken',
  'commenter',
  'lc',
  'totalComments',
  'totalPrice',
  'reaction',
] as const

/**
 * イベントルール: カウンターが threshold 増えるたびに、effect を value ぶん適用する
 * - timer: 残り時間を value 分延ばす
 * - life: ライフを value 個増やす
 */
export const DeadAirEventRuleSchema = z.object({
  counterKey: z.string().default('').catch(''),
  effect: z.enum(['timer', 'life']).default('timer').catch('timer'),
  value: z.number().min(1).max(10).default(1).catch(1),
  threshold: z.number().min(1).default(1).catch(1),
})
export type DeadAirEventRuleType = z.infer<typeof DeadAirEventRuleSchema>

/**
 * デッドエア DeadAir(実験枠)
 * - component: 表示コンポーネント ID(保存データは文字列。未同梱の ID も保持する)
 * - obstacle: 背景色を決める「妨害するもの」。将来 'black' | 'white' | (characterKey) を受け入れる想定
 * - initialMinutes / initialLives: 残り時間(分)とライフの初期値
 * - bonusEnabled: 時間が上限を超えたぶんをボーナスとして貯め、満タンでライフ +1
 * - eventRules: カウンターに応じた回復ルール
 * - optionalCounterKey: 表示だけするカウンター(null で非表示)
 */
export const DeadAirSchema = z.object({
  component: z.string().min(1).default(DEAD_AIR_DEFAULT_COMPONENT).catch(DEAD_AIR_DEFAULT_COMPONENT),
  obstacle: z.enum(['black', 'white']).default('black').catch('black'),
  initialMinutes: z.number().min(1).max(60).default(5).catch(5),
  initialLives: z.number().min(3).max(10).default(3).catch(3),
  bonusEnabled: z.boolean().default(false).catch(false),
  eventRules: z.array(DeadAirEventRuleSchema).default([]).catch([]),
  optionalCounterKey: z.string().nullable().default(null).catch(null),
})
export type DeadAirType = z.infer<typeof DeadAirSchema>
