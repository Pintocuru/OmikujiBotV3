// src/types/OmikujiData/ui/UiSchema.ts
import { z } from 'zod'
import { normalizedObject } from '@/types/core/ParsedDefault'
import { FontFamilySchema } from '@/types/OmikujiData/fontFamily'
import { UiLayoutSchema } from '@/types/OmikujiData/ui/UiLayoutSchema'
import { UiSettingsSchema } from '@/types/OmikujiData/ui/UiSettingsSchema'

/**
 * UiSchema
 */
export const UiSchema = z.object({
  layout: UiLayoutSchema.default('commentBubble').catch('commentBubble'),
  settings: normalizedObject(UiSettingsSchema, 'ui.settings'),
  fontFamily: FontFamilySchema,
})
export type UiType = z.infer<typeof UiSchema>
