// src/types/OmikujiData/CategoryType.ts
import { z } from 'zod'
import { PlaceholderSchema, PlaceholderType } from './assets/PlaceholderSchema'
import { CharacterSchema, CharacterType } from './assets/CharacterSchema'
import {
  CommentEventSchema,
  CommentEventType,
  ServiceEventSchema,
  ServiceEventType,
  eventCategoryLabel,
  EventCategoryType,
  TimerEventSchema,
  TimerEventType,
  ReactionEventType,
  ReactionEventSchema,
} from './events/EventSchema'
import { ActionSetSchema, ActionSetType } from './assets/ActionSet'

/**
 * RecordCategory
 */
export const recordCategoryLabel = [...eventCategoryLabel, 'actionSets', 'placeholders', 'characters'] as const
export type RecordCategoryType = (typeof recordCategoryLabel)[number]
export type RecordCategoryDataMap = {
  comments: Record<string, CommentEventType>
  timers: Record<string, TimerEventType>
  metas: Record<string, ServiceEventType>
  reactions: Record<string, ReactionEventType>
  actionSets: Record<string, ActionSetType>
  placeholders: Record<string, PlaceholderType>
  characters: Record<string, CharacterType>
}
export type RecordCategoryItemTypeMap = {
  comments: CommentEventType
  timers: TimerEventType
  metas: ServiceEventType
  reactions: ReactionEventType
  actionSets: ActionSetType
  placeholders: PlaceholderType
  characters: CharacterType
}

// カテゴリ更新用のスキーママップ
export const RecordCategorySchemaMap = {
  comments: CommentEventSchema,
  timers: TimerEventSchema,
  metas: ServiceEventSchema,
  reactions: ReactionEventSchema,
  actionSets: ActionSetSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const

export const isRulesCategory = (category: CategoryType): category is EventCategoryType => {
  return eventCategoryLabel.includes(category as EventCategoryType)
}
export const isRecordCategory = (category: CategoryType): category is RecordCategoryType => {
  return (recordCategoryLabel as readonly string[]).includes(category)
}

/**
 * settingsCategory
 */
export const settingsCategoryLabel = ['jsonMerge', 'components', 'appInfo'] as const
export type SettingsCategoryType = (typeof settingsCategoryLabel)[number]

/**
 * CategoryType
 */
export const categories = [
  'jsonMerge',
  'comments',
  'timers',
  'metas',
  'reactions',
  'actionSets',
  'placeholders',
  'characters',
  'components',
  'appInfo',
  'dataPacks',
] as const

// スキーマと型の定義
export const CategorySchema = z.enum(categories)
export type CategoryType = z.infer<typeof CategorySchema>
