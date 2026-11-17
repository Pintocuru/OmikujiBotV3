// src/types/OmikujiData/ui/schemas/counter.ts
import { CookieCounterSchema, LifeHourglassSchema, SnipeTimerSchema, StreamCounterSchema } from '@/types/ui/counter'

/** counter カテゴリの UI スキーマ */
export const counterUiSchemas = {
  cookieCounter: CookieCounterSchema,
  lifeHourglass: LifeHourglassSchema,
  snipeTimer: SnipeTimerSchema,
  streamCounter: StreamCounterSchema,
} as const
