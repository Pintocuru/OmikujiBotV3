// src/types/ui/GameRankingSchema.ts
import { normalizedObject } from '../core'
import { CharacterColorScheme } from '../OmikujiData/assets/CharacterSchema'
import { z } from 'zod'

/**
 * ランキング GameRanking
 */
// ランキングコンポーネントの選択肢(表示名は src/maps/ui/GameRankingMap.ts)
export const rankingComponents = ['standard', 'suikaGame'] as const
export type RankingComponent = (typeof rankingComponents)[number]

// ランキングのソート順
export const rankingSortOrders = ['new', 'high', 'low'] as const
export type RankingSortOrder = (typeof rankingSortOrders)[number]

// ゲームランキングのスキーマ
export const GameRankingSchema = z.object({
  component: z.enum(rankingComponents).default('standard').catch('standard'),
  color: normalizedObject(CharacterColorScheme),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrders).default('new').catch('new'),
})
export type GameRankingType = z.infer<typeof GameRankingSchema>
