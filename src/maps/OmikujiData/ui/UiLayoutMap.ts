// src/maps/OmikujiData/ui/UiLayoutMap.ts
import { UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウトプリセットのUI表示マップ
 */
export const uiLayoutMap: Record<NonNullable<UiLayoutType>, { label: string; description: string; kinds: UiKind[] }> = {
  commentBubble: {
    label: 'フキダシ',
    description: 'シンプルなフキダシでおみくじ結果を表示します。',
    kinds: ['commentBubble'],
  },
}
