// src/types/OmikujiData/ui/schemas/counter.ts
import { CookieCounterSchema, LifeHourglassSchema, SnipeTimerSchema } from '@/types/ui/counter'

/** counter カテゴリの UI スキーマ */
export const counterUiSchemas = {
  cookieCounter: CookieCounterSchema,
  lifeHourglass: LifeHourglassSchema,
  snipeTimer: SnipeTimerSchema,
} as const
