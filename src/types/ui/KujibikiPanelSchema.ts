// src/types/ui/KujibikiPanelSchema.ts
import { z } from 'zod'
import { enterMotions } from '../OmikujiData'

/**
 * くじ引き KujibikiPanel
 */
export interface KujibikiComponentConfig {
  label: string
  isVisual: boolean
}
export const kujibikiComponents = ['omikuji', 'flower', 'tarot', 'faceCutout'] as const
export type KujibikiComponent = (typeof kujibikiComponents)[number]

export const KujibikiPanelSchema = z.object({
  component: z.enum(kujibikiComponents).default('omikuji').catch('omikuji'),
  label: z.string().default('くじ引き').catch('くじ引き'),
  animation: z.enum(enterMotions).default('slideUp').catch('slideUp'),
  displaySeconds: z.number().min(0).max(60).default(10).catch(10),
  imagePath: z.string().optional(),
  iconSize: z.number().optional(),
})
export type KujibikiPanelType = z.infer<typeof KujibikiPanelSchema>
