// src/maps/ui/StreamCounterMap.ts
import type { LiverComponent, LiverLabelStyle, StreamComponentConfig, StreamDefaultKey } from '@/types/ui'

/**
 * ライバーカウンター StreamCounter
 */

export const streamComponentMap: Record<LiverComponent, StreamComponentConfig> = {
  basicCirclePlain: {
    label: '丸型シンプル',
    layout: 'horizontal', // 横並び
  },
  basicCircle: {
    label: '丸型カラー',
    layout: 'horizontal',
  },
  pixelBadgePlain: {
    label: 'ピクセルバッジ',
    layout: 'horizontal',
  },
  pixelBadge: {
    label: 'ピクセルカラー',
    layout: 'horizontal',
  },
  magicalStone: {
    label: '魔法石',
    layout: 'horizontal',
  },
  starBurst: {
    label: '星',
    layout: 'horizontal',
  },
  hexGrid: {
    label: 'ヘキサゴン',
    layout: 'horizontal',
  },
  badge: {
    label: 'バッジ',
    layout: 'vertical',
  },
}

export const labelStyleMap: Record<LiverLabelStyle, string> = {
  lucide: 'アイコン',
  emoji: '絵文字',
  text: 'テキスト',
}

export const streamDefaultMap: Record<StreamDefaultKey, string> = {
  syoken: '初コメ',
  commenter: 'コメントをしたユーザー数',
  lc: '配信コメント数',
  totalComments: '累計コメント数',
  upVote: '高評価数',
  viewer: '同時接続数',
  totalPrice: 'ギフト金額',
  follower: '登録者数',
  reaction: 'リアクション数(Youtubeのみ)',
}
