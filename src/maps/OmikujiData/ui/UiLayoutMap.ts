// src/maps/OmikujiData/ui/UiLayoutMap.ts
import { UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウトプリセットのUI表示マップ
 */
export const uiLayoutMap: Record<NonNullable<UiLayoutType>, { label: string; description: string }> = {
  commentBubble: {
    label: 'おみくじBOT',
    description: 'フキダシ＋トースト＋ランキングのセット',
  },
}
