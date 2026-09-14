// src/editor/stores/useNavigationStore.ts
import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { CategoryType, eventCategory, assetCategory, EventCategoryType, AssetCategoryType } from '@/types/OmikujiData/'
import { useGetEventData } from './useGetEventData'
import { useGetAssetData } from './useGetAssetData'

// 選択用に正規化した最低限の形
type NavigableItem = { key: string; order?: number }

export const useNavigationStore = defineStore('navigation', () => {
  const { getEvents } = useGetEventData()
  const { getAssets } = useGetAssetData()

  /**
   * 状態
   */
  const selectedCategory = ref<CategoryType>('comments')
  const selectedItemKey = ref<string | null>(null)
  const activeSection = ref<string | null>(null)

  /**
   * 計算プロパティ
   */

  const isEventCategory = (category: CategoryType): category is EventCategoryType =>
    (eventCategory as readonly string[]).includes(category)

  const isAssetCategory = (category: CategoryType): category is AssetCategoryType =>
    (assetCategory as readonly string[]).includes(category)

  // Events/Assets どちらかに属するカテゴリかどうか
  const isRecordCategory = (category: CategoryType): boolean => isEventCategory(category) || isAssetCategory(category)

  const isCurrentRecordCategory = computed(() => isRecordCategory(selectedCategory.value))

  // 現在のカテゴリの一覧を、key/order を持つ配列に正規化して取得
  const categoryArray = computed<NavigableItem[] | undefined>(() => {
    const category = selectedCategory.value

    if (isEventCategory(category)) {
      return [...getEvents(category)]
        .map((item) => ({ ...item, key: item.id }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    if (isAssetCategory(category)) {
      return Object.values(getAssets(category)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    return undefined
  })

  // 選択されているアイテムの詳細データ
  const selectedItem = computed(() => {
    if (!selectedItemKey.value || !categoryArray.value) return null
    return categoryArray.value.find((item) => item.key === selectedItemKey.value) ?? null
  })

  /**
   * 操作
   */

  const selectCategory = (category?: CategoryType) => {
    const safeCategory = category ?? 'comments'
    selectedCategory.value = safeCategory
    activeSection.value = 'Top'

    if (!isRecordCategory(safeCategory)) {
      selectedItemKey.value = null
      return
    }

    // categoryArray は selectedCategory 変更後の値を computed 経由で取り直す必要があるため、
    // ここでは直接算出する
    const list = isEventCategory(safeCategory)
      ? [...getEvents(safeCategory)].map((item) => ({ key: item.id, order: item.order }))
      : Object.values(getAssets(safeCategory as AssetCategoryType))

    const firstItem = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
    selectedItemKey.value = firstItem?.key ?? null
  }

  const selectItem = (key: string | null, section?: string) => {
    selectedItemKey.value = key
    if (section) activeSection.value = section
  }

  const clearSelection = () => {
    selectedItemKey.value = null
  }

  const selectNextItem = () => {
    if (!categoryArray.value || categoryArray.value.length === 0) {
      selectedItemKey.value = null
      return
    }

    const currentIndex = categoryArray.value.findIndex((item) => item.key === selectedItemKey.value)

    if (currentIndex === -1) {
      selectedItemKey.value = categoryArray.value[0].key
    } else if (currentIndex < categoryArray.value.length - 1) {
      selectedItemKey.value = categoryArray.value[currentIndex + 1].key
    } else if (categoryArray.value.length > 1) {
      selectedItemKey.value = categoryArray.value[currentIndex - 1].key
    } else {
      selectedItemKey.value = null
    }
  }

  watch(
    () => getEvents('comments'),
    (arr) => {
      if (arr.length > 0 && selectedItemKey.value === null) {
        selectedItemKey.value = arr[0].id
      }
    },
    { immediate: true }
  )

  return {
    selectedCategory,
    selectedItemKey,
    activeSection,
    isCurrentRecordCategory,
    categoryArray,
    selectedItem,
    isRecordCategory,
    selectCategory,
    selectItem,
    clearSelection,
    selectNextItem,
  }
})
