// src/ConfigMaker/stores/useGetRecordData.ts
// ! 廃止
import { storeToRefs } from 'pinia'
import { RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/'
import { useOmikujiStore } from './useOmikujiStore'

/**
 * レコード型カテゴリのデータアクセス機能を提供
 * 読み取り専用の操作のみを含む
 */
/** @deprecated getEvent または getAsset を使ってください */
export function useGetRecordData() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 単一アイテム取得
  /** @deprecated getEvent または getAsset を使ってください */
  const getItem = <K extends RecordCategoryType>(
    category: K,
    key: string
  ): RecordCategoryItemTypeMap[K] | undefined => {
    return (data.value[category] as Record<string, RecordCategoryItemTypeMap[K]>)?.[key]
  }

  // カテゴリ全体をMapとして取得
  /** @deprecated getEvent または getAsset を使ってください */
  const getCategoryMap = <K extends RecordCategoryType>(category: K): Record<string, RecordCategoryItemTypeMap[K]> => {
    return (data.value[category] as Record<string, RecordCategoryItemTypeMap[K]>) || {}
  }

  // カテゴリ全体をソート済み配列として取得
  /** @deprecated getEvent または getAsset を使ってください */
  const getCategoryArray = <K extends RecordCategoryType>(category: K): RecordCategoryItemTypeMap[K][] => {
    return Object.values(getCategoryMap(category)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  // アイテムの存在確認
  /** @deprecated getEvent または getAsset を使ってください */
  const hasItem = (category: RecordCategoryType, key: string): boolean => {
    return !!data.value[category]?.[key]
  }

  // カテゴリ内のアイテム数を取得
  /** @deprecated getEvent または getAsset を使ってください */
  const getItemCount = (category: RecordCategoryType): number => {
    return Object.keys(data.value[category] || {}).length
  }

  return {
    getItem,
    getCategoryMap,
    getCategoryArray,
    hasItem,
    getItemCount,
  }
}
