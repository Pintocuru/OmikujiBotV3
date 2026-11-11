// src/maps/OmikujiData/ui/UiLayoutMap.ts
import { UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウトプリセットのUI表示マップ
 * label は editor/i18n/maps/UiMapMessages.ts にあります
 */
export const uiLayoutMap: Record<NonNullable<UiLayoutType>, UiKind[]> = {
  /**
   * common
   */

  // フキダシ
  commentBubble: ['commentBubble', 'characterStage'],

  // ゲームランキング
  gameRanking: ['gameRanking'],

  // おみくじ
  kujibikiPanel: ['kujibikiPanel', 'characterStage'],

  /**
   * 2026-Q4
   */
  // 命の砂時計
  lifeHourglass: ['lifeHourglass'],

  /**
   * せすぴん(管理者)用
   */
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
