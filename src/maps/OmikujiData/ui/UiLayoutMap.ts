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
  gameRanking: {
    label: 'ゲームランキング',
    description: 'スイカゲーム等の結果をランキングボード形式で表示します。',
    kinds: ['gameRanking'],
  },
  sesupinTest: {
    label: 'テストレイアウト(管理者用)',
    description: 'すべて表示するレイアウト',
    kinds: [
      'characterStage',
      'commentBubble',
      'cookieCounter',
      'gameRanking',
      'kujibikiPanel',
      'liveClock',
      'streamCounter',
      'toastWidgets',
      'userBoard',
    ],
  },
}
