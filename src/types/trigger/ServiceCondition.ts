// src/types/trigger/ServiceCondition.ts
import z from 'zod'

/**
 * 配信メタ条件の種類
 */
export const serviceMetaConditions = ['viewer', 'upVote', 'follower'] as const

// スキーマと型の定義
export const ServiceMetaConditionSchema = z.enum(serviceMetaConditions)
export type ServiceMetaCondition = z.infer<typeof ServiceMetaConditionSchema>

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
