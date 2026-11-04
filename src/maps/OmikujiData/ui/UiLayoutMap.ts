// src/maps/OmikujiData/ui/UiLayoutMap.ts
import { UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウトプリセットのUI表示マップ
 * label は editor/i18n/maps/UiMapMessages.ts にあります
 */
export const uiLayoutMap: Record<NonNullable<UiLayoutType>, UiKind[]> = {
  // フキダシ
  commentBubble: ['commentBubble'],

  // ゲームランキング
  gameRanking: ['gameRanking'],

  // 命の砂時計
  lifeHourglass: ['lifeHourglass'],

  // せすぴん(管理者)用
  sesupinTest: [
    'characterStage',
    'commentBubble',
    'cookieCounter',
    'gameRanking',
    'kujibikiPanel',
    'lifeHourglass',
    'liveClock',
    'streamCounter',
    'toastWidgets',
    'userBoard',
  ],
}
