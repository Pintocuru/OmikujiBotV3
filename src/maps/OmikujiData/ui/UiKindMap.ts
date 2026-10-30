// src/maps/OmikujiData/ui/UiKindMap.ts
import type { UiKind } from '@/types/OmikujiData'
import { DisplayMetaLucide } from '@/common/LucideIcon/DisplayMetaLucide'
import { DisplayMeta } from '@/types/core'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

export const uiKindMap: Record<UiKind, DisplayMetaLucide> = {
  characterStage: {
    label: 'キャラクターステージ',
    icon: 'UserSquare',
    description: 'キャラクター画像だけを、指定した位置・秒数で表示します(演出用)。',
  },
  commentBubble: {
    label: 'フキダシ',
    icon: 'MessageSquare',
    description: 'BOTの発言内容を吹き出し形式で表示します。',
  },
  gameRanking: {
    label: 'ゲームランキング',
    icon: 'Trophy',
    description: 'スイカゲーム等の結果をランキングボード形式で表示します。',
  },
  cookieCounter: {
    label: 'クッキーカウンター',
    icon: 'Cookie',
    description: '配信のカウントをクッキー風のカウンターで表示します。',
  },
  kujibikiPanel: {
    label: 'くじ引きパネル',
    icon: 'Sparkles',
    description: 'おみくじ・占いの結果をパネル形式で表示します。',
  },
  liveClock: {
    label: 'ライブクロック',
    icon: 'Clock',
    description: '時計とメッセージを表示します。',
  },
  streamCounter: {
    label: '配信カウンター',
    icon: 'Hash',
    description: '同時接続数や高評価数などを表示します。',
  },
  toastWidgets: {
    label: 'トースト',
    icon: 'Bell',
    description: '通知メッセージをトースト形式で表示します。',
  },
  userBoard: {
    label: 'ユーザーボード',
    icon: 'Users',
    description: 'ユーザーの得点・チームを、得点リストやチームのバー・スコアボードで表示します。',
  },
}

export const uiKindMetaMap: Record<UiKind, DisplayMeta> = {
  characterStage: {
    label: 'キャラクターステージ',
    description: 'キャラクター画像だけを、指定した位置・秒数で表示します(演出用)。',
  },
  commentBubble: {
    label: 'フキダシ',
    description: 'BOTの発言内容を吹き出し形式で表示します。',
  },
  gameRanking: {
    label: 'ゲームランキング',
    description: 'スイカゲーム等の結果をランキングボード形式で表示します。',
  },
  cookieCounter: {
    label: 'クッキーカウンター',
    description: '配信のカウントをクッキー風のカウンターで表示します。',
  },
  kujibikiPanel: {
    label: 'くじ引きパネル',
    description: 'おみくじ・占いの結果をパネル形式で表示します。',
  },
  liveClock: {
    label: 'ライブクロック',
    description: '時計とメッセージを表示します。',
  },
  streamCounter: {
    label: '配信カウンター',
    description: '同時接続数や高評価数などを表示します。',
  },
  toastWidgets: {
    label: 'トースト',
    description: '通知メッセージをトースト形式で表示します。',
  },
  userBoard: {
    label: 'ユーザーボード',
    description: 'ユーザーの得点・チームを、得点リストやチームのバー・スコアボードで表示します。',
  },
}

export const uiKindIcons: Record<UiKind, LucideIconName> = {
  characterStage: 'UserSquare',
  commentBubble: 'MessageSquare',
  gameRanking: 'Trophy',
  cookieCounter: 'Cookie',
  kujibikiPanel: 'Sparkles',
  liveClock: 'Clock',
  streamCounter: 'Hash',
  toastWidgets: 'Bell',
  userBoard: 'Users',
}
