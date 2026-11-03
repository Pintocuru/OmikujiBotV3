// src/types/ui/GameRankingSchema.ts
import { normalizedObject } from '../core'
import { CharacterColorScheme } from '../OmikujiData/assets/CharacterSchema'
import { z } from 'zod'

/**
 * ランキング GameRanking
 */
// GameRanking のコンポーネントセット
export const rankingComponentSets = {
  standard: ['standard', 'suikaGame'],
} as const

export type RankingComponentSets = typeof rankingComponentSets
export type RankingComponentSet = keyof RankingComponentSets

// セット別の ID 型
export type RankingComponentOf<S extends RankingComponentSet> = RankingComponentSets[S][number]

// 全 ID
export type RankingComponent = RankingComponentOf<RankingComponentSet>

// ランキングのソート順
export const rankingSortOrders = ['new', 'high', 'low'] as const
export type RankingSortOrder = (typeof rankingSortOrders)[number]

// ゲームランキングのスキーマ
export const GameRankingSchema = z.object({
  component: z.string().min(1).default('standard').catch('standard'), // 保存データは文字列(未同梱の ID も保持する。空文字は standard に戻す)
  color: normalizedObject(CharacterColorScheme, 'ui.GameRanking.color'),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrders).default('new').catch('new'),
  uniqueUser: z.boolean().default(false).catch(false), // true: 1ユーザーにつき最新の1件だけ表示する
})
export type GameRankingType = z.infer<typeof GameRankingSchema>
