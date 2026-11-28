// src/ui/uiLayoutMap.ts
import { UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウトプリセットのUI表示マップ
 * label は editor/i18n/maps/UiMapMessages.ts にあります
 */
export const uiLayoutMap: Partial<Record<NonNullable<UiLayoutType>, UiKind[]>> = {
  /**
   * common
   */

  // フキダシ
  commentBubble: ['commentBubble', 'characterStage'],

  // ゲームランキング
  gameRanking: ['gameRanking'],

  // おみくじ
  kujibikiPanel: ['kujibikiPanel', 'characterStage'],
}

export const registerUiLayoutMap = (layouts: Partial<Record<NonNullable<UiLayoutType>, UiKind[]>>) =>
  Object.assign(uiLayoutMap, layouts)
