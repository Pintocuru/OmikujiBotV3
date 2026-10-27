// src/types/OmikujiData/ui/UiSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../../core/ParsedDefault'
import { FontFamilySchema } from '../fontFamily'
import { UiLayoutSchema } from './UiLayoutSchema'
import { UiSettingsSchema } from './UiSettingsSchema'

/**
 * UiSchema
 */
export const UiSchema = z.object({
  layout: UiLayoutSchema.default('commentBubble').catch('commentBubble'),
  settings: normalizedObject(UiSettingsSchema),
  fontFamily: FontFamilySchema,
})
export type UiType = z.infer<typeof UiSchema>
