// src/types/OmikujiData/ActionSet.ts
import { BaseRecordSchema } from '../core/BaseSchema'
import { PostFlowArraySchema } from './PostFlow'

/**
 * ActionSet
 */
export const ActionSetSchema = BaseRecordSchema.extend({
  postFlows: PostFlowArraySchema,
})
