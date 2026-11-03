// src/types/ui/KujibikiPanelSchema.ts
import { z } from 'zod'
import { enterMotions } from '../OmikujiData/assets/EnterMotionSchema'

// KujibikiPanel のコンポーネントセット
export const kujibikiComponentSets = {
  standard: ['omikuji', 'flower'],
  fortune: ['tarot'],
  special: ['faceCutout'],
} as const

// 全コンポーネント ID
export type KujibikiComponent = (typeof kujibikiComponentSets)[keyof typeof kujibikiComponentSets][number]

// コンポーネントセット名
export type KujibikiComponentSet = keyof typeof kujibikiComponentSets

// デフォルトコンポーネント
export const KUJIBIKI_PANEL_DEFAULT_COMPONENT = 'omikuji' as const

/**
 * くじ引き KujibikiPanel
 */
export const KujibikiPanelSchema = z.object({
  component: z
    .string()
    .default(KUJIBIKI_PANEL_DEFAULT_COMPONENT)
    .catch(KUJIBIKI_PANEL_DEFAULT_COMPONENT)
    .transform((value) => (value === '' ? KUJIBIKI_PANEL_DEFAULT_COMPONENT : value)),
  label: z.string().default('くじ引き').catch('くじ引き'),
  animation: z.enum(enterMotions).default('slideUp').catch('slideUp'),
  displaySeconds: z.number().min(0).max(60).default(10).catch(10),
  imagePath: z.string().optional(),
  iconSize: z.number().optional(),
})
export type KujibikiPanelType = z.infer<typeof KujibikiPanelSchema>
