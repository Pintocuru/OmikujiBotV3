// src/types/OmikujiData/assets/ActionSetSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { ScenarioStepArraySchema } from './ScenarioStepSchema'

/**
 * Scenario
 */
export const ScenarioSchema = BaseRecordSchema.extend({
  steps: ScenarioStepArraySchema,
})
export type ScenarioType = z.infer<typeof ScenarioSchema>
