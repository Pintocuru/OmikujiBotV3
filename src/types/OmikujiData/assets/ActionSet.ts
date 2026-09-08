// src/types/OmikujiData/assets/ActionSet.ts
import { z } from 'zod'
import { BaseRecordSchema } from '../../core/BaseSchema'
import { PostFlowArraySchema } from './PostFlow'

/**
 * ActionSet
 */
export const ActionSetSchema = BaseRecordSchema.extend({
  postFlows: PostFlowArraySchema,
})
export type ActionSetType = z.infer<typeof ActionSetSchema>
