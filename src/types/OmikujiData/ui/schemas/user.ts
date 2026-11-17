// src/types/OmikujiData/ui/schemas/user.ts
import { FlightSeatSchema, LabelMakerSchema, LuckyDrawSchema, UserBoardSchema } from '@/types/ui/user'

/** user カテゴリの UI スキーマ */
export const userUiSchemas = {
  flightSeat: FlightSeatSchema,
  labelMaker: LabelMakerSchema,
  luckyDraw: LuckyDrawSchema,
  userBoard: UserBoardSchema,
} as const
