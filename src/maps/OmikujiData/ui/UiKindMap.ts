//
import { UiKind } from '@/types/OmikujiData'

// Map定義
export const uiKindMap: Record<UiKind, { label: string; icon: string; description: string }> = {
  bubble: {
    label: 'フキダシ',
    icon: 'MessageSquare',
    description: 'BOTの発言内容を吹き出し形式で表示します。',
  },
  flashBanner: {
    label: 'ニュース',
    icon: 'Megaphone',
    description: 'ニュース風のテロップを表示します。',
  },
  commentSpin: {
    label: 'コメントスピン',
    icon: 'Shuffle',
    description: 'コメントをランダムに選んでルーレット風に表示します。',
  },
  liveClock: {
    label: 'クロック',
    icon: 'Clock',
    description: 'メッセージを表示する時計です。',
  },
  kujibikiPanel: {
    label: 'くじ引き',
    icon: 'Bomb',
    description: 'test',
  },
  toast: {
    label: 'トースト',
    icon: 'Bell',
    description: '一時的な通知メッセージを表示します。',
  },
  ranking: {
    label: 'ランキング',
    icon: 'Trophy',
    description: 'ゲームやイベントの順位一覧を表示します。',
  },
  counter: {
    label: 'カウンター',
    icon: 'Hash',
    description: '数値の増減やユーザーリストを表示します。',
  },
  streamCounter: {
    label: 'ライバーカウンター',
    icon: 'Hash',
    description: '高評価・同接数等、複数のさまざまなカウンターを表示します',
  },
  cookieCounter: {
    label: 'クッキーカウンター',
    icon: 'Cookie',
    description: '高評価・同接数等、単一またはセットのカウンターを表示します',
  },
  winnerGroup: {
    label: 'ラッキーメンバーズ',
    icon: 'Crown',
    description: 'コメントしたユーザーをランダムに表示します。',
  },
  flightSeat: {
    label: 'フライトシート',
    icon: 'Plane',
    description: '座席風レイアウトでコメントしたユーザーを一覧表示します。',
  },
  socialRoster: {
    label: 'ソーシャルユーザーリスト',
    icon: 'Users',
    description: 'コメントしたユーザーをソーシャルゲーム風のグリッドで一覧表示します',
  },
  deadAir: {
    label: '15分で初コメが来ないと',
    icon: 'Bomb',
    description: 'test',
  },
  GiftRanking: {
    label: 'ギフトランキング',
    icon: 'Gift',
    description: 'ギフトランキングを表示します',
  },
}
