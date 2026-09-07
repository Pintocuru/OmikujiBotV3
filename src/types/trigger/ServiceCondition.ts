// shared/types/Threshold/ServiceCondition.ts
import z from 'zod'

/**
 * 配信メタ条件の種類
 */
export const serviceMetaConditions = ['viewer', 'upVote', 'follower'] as const

// スキーマと型の定義
export const ServiceMetaConditionSchema = z.enum(serviceMetaConditions)
export type ServiceMetaCondition = z.infer<typeof ServiceMetaConditionSchema>

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

// @onecomme.com/onesdk/types/Service
// TODO:v3では「プラットフォームか外部か」でのみ適用する
export const serviceTypeValues = [
  'youtube',
  'twicas',
  'twitch',
  'niconama',
  'showroom',
  'bilibili',
  'mirrativ',
  'mixch',
  'twitter',
  'doneru',
  'tiktok',
  'streamlabs',
  'kick',
  'vtips',
  'external',
  'system',
] as const

export type ServiceType = (typeof serviceTypeValues)[number]
export const enabledService = ['platforms', ...serviceTypeValues] as const
export type EnabledServiceType = (typeof enabledService)[number]
export const EnabledServiceConditionSchema = z.enum(enabledService).default('platforms').catch('platforms')

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
