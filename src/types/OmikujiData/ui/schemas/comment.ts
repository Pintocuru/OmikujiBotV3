// src/types/OmikujiData/ui/schemas/comment.ts
import { UserCommentSchema } from '@/types/ui/comment'

/** comment カテゴリの UI スキーマ */
export const commentUiSchemas = {
  userComment: UserCommentSchema,
} as const
