// src/maps/OmikujiData/ui/UiLayoutMap.ts
import { UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウトプリセットのUI表示マップ
 */
export const uiLayoutMap: Record<
  NonNullable<UiLayoutType>,
  {
    label: string
    description: string
    kinds: UiKind[]
  }
> = {
  OmikujiBot: {
    label: 'おみくじBOT',
    description: 'フキダシ＋トースト＋ランキングのセット',
    kinds: ['bubble', 'toast', 'ranking'],
  },
  VarietySlot: {
    label: 'クイズせかいはバラエティスロット',
    description: 'クイズせかいはバラエティスロット用のセット',
    kinds: ['commentSpin', 'cookieCounter'],
  },
  VarietySlotRanking: {
    label: 'バラエティスロットランキング',
    description: 'クイズせかいはバラエティスロットランキング用のセット',
    kinds: ['commentSpin', 'cookieCounter', 'ranking'],
  },
  GogoBonus: {
    label: 'ペカるLAMP',
    description: 'ペカるLAMP用のセット',
    kinds: ['commentSpin', 'cookieCounter'],
  },
  Golden65536: {
    label: 'ゴールデン65536',
    description: 'コメントスロット＋ライバーカウンターのセット',
    kinds: ['commentSpin', 'streamCounter'],
  },
}
