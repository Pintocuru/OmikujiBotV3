// src/types/ui/KujibikiPanelSchema.ts
import { z } from 'zod'
import { enterMotions } from '../OmikujiData/assets/EnterMotionSchema'

// KujibikiPanel のコンポーネントセット
export const kujibikiComponentSets = {
  standard: ['omikuji', 'flower'],
  fortune: ['tarot'],
  special: ['faceCutout'],
} as const

export type KujibikiComponentSets = typeof kujibikiComponentSets
export type KujibikiComponentSet = keyof KujibikiComponentSets

// セット別の ID 型
export type KujibikiComponentOf<S extends KujibikiComponentSet> = KujibikiComponentSets[S][number]

// 全 ID
export type KujibikiComponent = KujibikiComponentOf<KujibikiComponentSet>

/**
 * くじ引き KujibikiPanel
 */
export const KujibikiPanelSchema = z.object({
  component: z.string().default('omikuji'),
  label: z.string().default('くじ引き').catch('くじ引き'),
  animation: z.enum(enterMotions).default('slideUp').catch('slideUp'),
  displaySeconds: z.number().min(0).max(60).default(10).catch(10),
  imagePath: z.string().optional(),
  iconSize: z.number().optional(),
})
export type KujibikiPanelType = z.infer<typeof KujibikiPanelSchema>
