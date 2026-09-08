//
import { EnabledServiceType, ServiceMetaCondition } from '@/types/trigger'

// Map定義
export const serviceMetaConditionMap: Record<ServiceMetaCondition, { label: string; description: string }> = {
  viewer: {
    label: '現在の枠の視聴ユーザー数',
    description: '現在の配信枠を視聴しているユーザー数で判定します',
  },
  upVote: {
    label: '現在の枠の高評価数',
    description: '現在の配信枠についた高評価数で判定します',
  },
  follower: {
    label: 'チャンネルの登録者数',
    description: 'チャンネルに登録されているユーザー数で判定します',
  },
}

export const serviceTypeMap: Record<EnabledServiceType, string> = {
  platforms: '配信プラットフォーム',
  youtube: 'YouTube',
  twicas: 'ツイキャス',
  twitch: 'Twitch',
  niconama: 'ニコニコ生放送',
  showroom: 'SHOWROOM',
  bilibili: 'bilibili',
  mirrativ: 'Mirrativ',
  mixch: 'ミクチャ',
  twitter: 'X(Twitter)',
  doneru: 'Doneru',
  tiktok: 'TikTok',
  streamlabs: 'Streamlabs',
  kick: 'Kick',
  vtips: 'VTips',
  external: '外部サービス',
  system: 'システム内部',
}
