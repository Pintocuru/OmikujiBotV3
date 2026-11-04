// src/maps/ui/StreamCounterMap.ts
import type { StreamDefaultKey } from '@/types/ui'

/**
 * ライバーカウンター StreamCounter
 */

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
