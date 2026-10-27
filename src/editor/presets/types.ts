// src/editor/presets/types.ts
import { AssetCategoryDataMap, DataCategoryType, EventCategoryDataMap, EventCategoryType } from '@/types/OmikujiData/'

/**
 * プリセットが生成するデータ
 * - assets: 先に追加される(events から参照されるため)
 * - events: assets の後に追加される。kind は category で決まる
 */
export interface PresetBuildResult<C extends DataCategoryType> {
  assets?: { [A in keyof AssetCategoryDataMap]?: Partial<AssetCategoryDataMap[A]>[] }
  events?: C extends EventCategoryType ? Partial<EventCategoryDataMap[C]>[] : never
  /** true なら、追加した events を既存の先頭へ移動する(例: 除外ルール) */
  eventsToTop?: boolean
}

/**
 * プリセット定義
 * ラベル・説明は i18n の `presets.{category}.{id}.label|description`
 */
export interface PresetDefinition<C extends DataCategoryType = DataCategoryType> {
  id: string
  category: C
  /** 呼ぶたびに新しい key を発行する(同じプリセットを何度でも追加できる) */
  build: () => PresetBuildResult<C>
}
