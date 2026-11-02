// src/types/OmikujiData/assets/ScenarioSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { ScenarioStepRecordSchema } from './ScenarioStepSchema'

/**
 * Scenario
 */
export const ScenarioSchema = BaseRecordSchema.extend({
  steps: ScenarioStepRecordSchema,
})
export type ScenarioType = z.infer<typeof ScenarioSchema>
