// src/types/OmikujiData/assets/ActionSetSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { PostFlowArraySchema } from './PostFlow'

/**
 * ActionSet
 */
export const ActionSetSchema = BaseRecordSchema.extend({
  postFlows: PostFlowArraySchema,
})
export type ActionSetType = z.infer<typeof ActionSetSchema>
