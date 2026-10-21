// src/types/ui/GameRankingSchema.ts
import { normalizedObject } from '@/types/core'
import { CharacterColorScheme } from '@/types/OmikujiData'
import { z } from 'zod'

/**
 * ランキング GameRanking
 */
// ランキングコンポーネントの選択肢
export const rankingComponentMap = {
  standard: {
    label: 'スタンダード',
  },
  suikaGame: {
    label: 'スイカゲーム風ランキング',
  },
} as const
const rankingComponentsEnum = Object.keys(rankingComponentMap) as RankingComponent[]
export type RankingComponent = keyof typeof rankingComponentMap

// ランキングのソート順
export const rankingSortOrderMap = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
} as const
const rankingSortOrder = Object.keys(rankingSortOrderMap) as RankingSortOrder[]
export type RankingSortOrder = keyof typeof rankingSortOrderMap

// ゲームランキングのスキーマ
export const GameRankingSchema = z.object({
  component: z.enum(rankingComponentsEnum).default('standard').catch('standard'),
  color: normalizedObject(CharacterColorScheme),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrder).default('new').catch('new'),
})
export type GameRankingType = z.infer<typeof GameRankingSchema>
