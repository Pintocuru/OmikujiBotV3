// src/ui/types/GameRankingSchema.ts
import { CharacterColorScheme, normalizedObject } from '@/types/OmikujiData'
import { z } from 'zod'

/**
 * ランキング GameRanking
 */
// ランキングコンポーネントの選択肢
export const rankingComponentMap = {
  standard: {
    label: 'スタンダード',
  },
  rankStandard: {
    label: 'スタンダード（スコア付き）',
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
  component: z.enum(rankingComponentsEnum).default('rankStandard').catch('rankStandard'),
  color: normalizedObject(CharacterColorScheme),
  limit: z.number().min(1).max(20).default(5).catch(5),
  sortOrder: z.enum(rankingSortOrder).default('new').catch('new'),
})
export type GameRankingType = z.infer<typeof GameRankingSchema>
