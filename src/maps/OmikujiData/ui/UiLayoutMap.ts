// src/maps/OmikujiData/ui/UiLayoutMap.ts
import { UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウトプリセットのUI表示マップ
 */
export const uiLayoutMap: Record<NonNullable<UiLayoutType>, { label: string; description: string; kinds: UiKind[] }> = {
  commentBubble: {
    label: 'おみくじBOT',
    description: 'フキダシ＋トースト＋ランキングのセット',
    kinds: ['commentBubble'], // このレイアウトが使う UI
  },
}
