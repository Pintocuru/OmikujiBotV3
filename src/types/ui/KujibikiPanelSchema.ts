// src/types/ui/KujibikiPanelSchema.ts
import { z } from 'zod'
import { enterMotions } from '../OmikujiData/assets/EnterMotionSchema'

/** KujibikiPanel の既知コンポーネント ID。追加時はセット登録と合わせて更新する。 */
export const kujibikiComponentIds = ['omikuji', 'flower', 'tarot', 'faceCutout'] as const
export const KUJIBIKI_PANEL_DEFAULT_COMPONENT = 'omikuji' as const
export type KujibikiComponent = (typeof kujibikiComponentIds)[number]

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
