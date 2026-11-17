// src/types/OmikujiData/ui/schemas/game.ts
import {
  DeadAirSchema,
  GameRankingSchema,
  LiverBingoSchema,
} from '@/types/ui/game'

/** game カテゴリの UI スキーマ */
export const gameUiSchemas = {
  deadAir: DeadAirSchema,
  gameRanking: GameRankingSchema,
  liverBingo: LiverBingoSchema,
} as const
