// src/types/OmikujiData/UiSettings/GameRankingSchema.ts
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
    label: 'スタンダード（スコア付き・Legacy）',
  },
} as const
const rankingComponentsEnum = Object.keys(rankingComponentMap) as RankingComponent[]
export type RankingComponent = keyof typeof rankingComponentMap

//
export const rankingSortOrderMap = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
} as const
const rankingSortOrder = Object.keys(rankingSortOrderMap) as RankingSortOrder[]
export type RankingSortOrder = keyof typeof rankingSortOrderMap

export const GameRankingSchema = z.object({
  component: z.enum(rankingComponentsEnum).default('rankStandard').catch('rankStandard'),
  title: z.string().default('🍉スイカランキング🍉').catch('🍉スイカランキング🍉'),
  daisyUiColor: z.any().catch(''), // TODO: daisyUiカラー。light か dark の2択。
  characterKey: z.string().catch(''), // カラーデータ
  limit: z.number().min(1).max(20).default(5).catch(5), // TODO: UI側でランキングを作成するので、必要なプロパティを追加したい
  sortOrder: z.enum(rankingSortOrder).default('new').catch('new'),
})
export type GameRankingType = z.infer<typeof GameRankingSchema>
