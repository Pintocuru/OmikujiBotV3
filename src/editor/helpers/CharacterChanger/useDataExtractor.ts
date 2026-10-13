// src/editor/helpers/CharacterChanger/useDataExtractor.ts
import { computed, ComputedRef } from 'vue'
import { EventCategoryType, EventType, ActionSetType, PostFlowType, OmikujiItemType } from '@/types/OmikujiData/'
import { categoryMap } from '@/maps/OmikujiData'
import { useGetRecordData } from '@/editor/stores/useGetRecordData'

/**
 * カテゴリタイプ（rules系とactions）
 */
export type TargetCategoryType = EventCategoryType | 'actions'

/**
 * 変更スコープタイプ
 */
export type ChangeScope = 'category' | 'single'

/**
 * 各カテゴリからPostAction配列を抽出するためのコンポーザブル
 * selectedIdがある場合は単一アイテムのみ、ない場合はカテゴリ全体を対象とする
 */
export function useDataExtractor(category: TargetCategoryType, selectedId?: string) {
  const { getItem, getCategoryMap, getCategoryArray } = useGetRecordData()

  // 変更スコープ（全体 or 単一）
  const changeScope = computed<ChangeScope>(() => (selectedId ? 'single' : 'category'))

  // スコープに応じたラベル
  const scopeLabel = computed(() => {
    if (changeScope.value === 'single') return 'このイベント'
    return `${categoryMap[category].label}全体`
  })

  /**
   * カテゴリ内の対象アイテムを取得
   * selectedIdがある場合は単一アイテム、ない場合は全アイテム
   */
  const allItems = computed(() => {
    if (category === 'actions') {
      const actions = getCategoryMap('actions')
      if (selectedId) {
        const item = actions[selectedId]
        return item ? [item] : []
      }
      return Object.values(actions) as ActionSetType[]
    } else {
      if (selectedId) {
        const item = getItem(category, selectedId)
        return item ? [item as EventType] : []
      }
      return getCategoryArray(category) as EventType[]
    }
  })

  /**
   * 全PostActionを平坦化して取得
   */
  const allPostActions: ComputedRef<PostFlowType[]> = computed(() => {
    if (category === 'actions') {
      const items = allItems.value as ActionSetType[]
      return items.flatMap((item) => item.postActions)
    } else {
      const rules = allItems.value as EventType[]
      return rules.flatMap((rule) => rule.omikuji.flatMap((omikuji: OmikujiItemType) => omikuji.postActions))
    }
  })

  /**
   * 全ActionSetを取得（GameScriptsのcharacterKeyを含む処理用）
   */
  const allActions: ComputedRef<ActionSetType[]> = computed(() => {
    if (category === 'actions') {
      return allItems.value as ActionSetType[]
    } else {
      const rules = allItems.value as EventType[]
      return rules.flatMap((rule) => rule.omikuji) as ActionSetType[]
    }
  })

  /**
   * アイテム数
   */
  const totalItems = computed(() => allItems.value.length)

  return {
    changeScope,
    scopeLabel,
    allItems,
    allPostActions,
    allActions,
    totalItems,
  }
}
