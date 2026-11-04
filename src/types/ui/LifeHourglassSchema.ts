// src/types/ui/LifeHourglassSchema.ts
import { z } from 'zod'

// LifeHourglass のコンポーネントセット
export const lifeHourglassComponentSets = {
  standard: ['sandBowl'],
} as const

export type LifeHourglassComponentSets = typeof lifeHourglassComponentSets
export type LifeHourglassComponentSet = keyof LifeHourglassComponentSets

// セット別の ID 型
export type LifeHourglassComponentOf<S extends LifeHourglassComponentSet> = LifeHourglassComponentSets[S][number]

// 全 ID
export type LifeHourglassComponent = LifeHourglassComponentOf<LifeHourglassComponentSet>

/** 既定の表示コンポーネント ID(スキーマ・検証・エディターで共有する 1か所の定数) */
export const LIFE_HOURGLASS_DEFAULT_COMPONENT = 'sandBowl'

/**
 * 命の砂時計 LifeHourglass(実験枠)
 * - component: 表示コンポーネント ID(保存データは文字列。未同梱の ID も保持する)
 * - showMessage: 画面の隅の小さなメッセージ(世界観)を出すか
 * - carryOver: 前回までの砂粒(通算)を引き継いで表示するか
 */
export const LifeHourglassSchema = z.object({
  component: z.string().min(1).default(LIFE_HOURGLASS_DEFAULT_COMPONENT).catch(LIFE_HOURGLASS_DEFAULT_COMPONENT),
  showMessage: z.boolean().default(true).catch(true),
  carryOver: z.boolean().default(false).catch(false),
})
export type LifeHourglassType = z.infer<typeof LifeHourglassSchema>
