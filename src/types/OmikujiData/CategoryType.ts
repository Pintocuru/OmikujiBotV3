// src/types/OmikujiData/CategoryType.ts
import { z } from 'zod'
import { PlaceholderSchema, PlaceholderType } from './assets/PlaceholderSchema'
import { CharacterSchema, CharacterType } from './assets/CharacterSchema'
import {
  CommentEventSchema,
  CommentEventType,
  ServiceEventSchema,
  ServiceEventType,
  TimerEventSchema,
  TimerEventType,
  ReactionEventType,
  ReactionEventSchema,
} from './events/EventSchema'
import { ActionSetSchema, ActionSetType } from './assets/ActionSet'
import { assetCategory } from './assets'
import { eventCategory } from './events'

/**
 * RecordCategory
 * TODO:event/assetsで分けたので廃止
 */

/** @deprecated 新バージョンでは使用不可です */
export const recordCategoryLabel = [...eventCategoryLabel, 'actionSets', 'placeholders', 'characters'] as const

/** @deprecated 新バージョンでは使用不可です */
export type RecordCategoryType = (typeof recordCategoryLabel)[number]

/** @deprecated 新バージョンでは使用不可です */
export type RecordCategoryDataMap = {
  comments: Record<string, CommentEventType>
  timers: Record<string, TimerEventType>
  metas: Record<string, ServiceEventType>
  reactions: Record<string, ReactionEventType>
  actionSets: Record<string, ActionSetType>
  placeholders: Record<string, PlaceholderType>
  characters: Record<string, CharacterType>
}

/** @deprecated 新バージョンでは使用不可です */
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
/** @deprecated 新バージョンでは使用不可です */
export const RecordCategorySchemaMap = {
  comments: CommentEventSchema,
  timers: TimerEventSchema,
  metas: ServiceEventSchema,
  reactions: ReactionEventSchema,
  actionSets: ActionSetSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const

/** @deprecated 新バージョンでは使用不可です */
export const isRecordCategory = (category: CategoryType): category is RecordCategoryType => {
  return (recordCategoryLabel as readonly string[]).includes(category)
}

/**
 * settingsCategory
 */
export const settingsCategoryLabel = ['jsonMerge', 'ui', 'appInfo'] as const
export type SettingsCategoryType = (typeof settingsCategoryLabel)[number]

/**
 * CategoryType
 */
export const categories = ['jsonMerge', ...eventCategory, ...assetCategory, 'ui', 'appInfo'] as const

// スキーマと型の定義
export const CategorySchema = z.enum(categories)
export type CategoryType = z.infer<typeof CategorySchema>
