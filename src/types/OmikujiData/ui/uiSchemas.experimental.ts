// src/types/OmikujiData/ui/uiSchemas.experimental.ts
import {
  DeadAirSchema,
  FlightSeatSchema,
  LabelMakerSchema,
  FlashBannerSchema,
  LifeHourglassSchema,
  LiverBingoSchema,
  LuckyDrawSchema,
  SnipeTimerSchema,
} from '@/types/ui'

/**
 * 実験中の UI(捨てる候補)。
 * 気に入ったら 1 行を uiSchemas.stable.ts に移す。失敗したら 1 行消す。
 */
export const experimentalUiSchemas = {
  deadAir: DeadAirSchema, // デッドエア(OmikujiBotV2 から移植)
  flightSeat: FlightSeatSchema, // フライトシート(OmikujiBotV2 から移植)
  labelMaker: LabelMakerSchema, // ラベルメーカー(旧 CounterPreview のユーザーリストを移植)
  flashBanner: FlashBannerSchema, // ニュースフラッシュ(旧 V2 FlashBanner から移植)
  lifeHourglass: LifeHourglassSchema, // 命の砂時計(仮名 hourglass は廃止)
  liverBingo: LiverBingoSchema, // ライバービンゴ(OmikenTemplates から移植)
  luckyDraw: LuckyDrawSchema, // 抽選(旧 WinnerGroup から移植)
  snipeTimer: SnipeTimerSchema, // スナイプタイマー(旧 NextTimer から移植)
} as const
