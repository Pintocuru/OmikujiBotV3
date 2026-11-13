// src/types/OmikujiData/ui/uiSchemas.experimental.ts
import { LifeHourglassSchema, LiverBingoSchema, SnipeTimerSchema } from '@/types/ui'

/**
 * 実験中の UI(捨てる候補)。
 * 気に入ったら 1 行を uiSchemas.stable.ts に移す。失敗したら 1 行消す。
 */
export const experimentalUiSchemas = {
  lifeHourglass: LifeHourglassSchema, // 命の砂時計(仮名 hourglass は廃止)
  liverBingo: LiverBingoSchema, // ライバービンゴ(OmikenTemplates から移植)
  snipeTimer: SnipeTimerSchema, // スナイプタイマー(旧 NextTimer から移植)
} as const
