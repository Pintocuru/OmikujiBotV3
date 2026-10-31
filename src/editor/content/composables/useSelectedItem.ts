// src/editor/content/composables/useSelectedItem.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { type BaseRecordType } from '@/types/core'
import { type EventCategoryDataMap, type EventCategoryType } from '@/types/OmikujiData'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

/**
 * 選択中のアイテム(Events / Assets)を、BaseEditor に渡せる形で読み書きする。
 * イベントは id、アセットは key で識別する(navigationStore の selectedItemKey がどちらも指す)。
 */
export const useSelectedItem = () => {
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getEvent, isEventCategory } = useGetEventData()
  const { getAsset, isAssetCategory } = useGetAssetData()
  const { updateEvent, updateAsset } = useOmikujiStore()

  const selectedItem = computed<BaseRecordType | null>({
    get: () => {
      const category = selectedCategory.value
      const key = selectedItemKey.value
      if (!key) return null
      if (isEventCategory(category)) return getEvent(category, key) ?? null
      if (isAssetCategory(category)) return getAsset(category, key) ?? null
      return null
    },
    set: (value) => {
      const category = selectedCategory.value
      const key = selectedItemKey.value
      if (!key || !value) return
      if (isEventCategory(category)) {
        updateEvent(category, key, value as Partial<EventCategoryDataMap[EventCategoryType]>)
      } else if (isAssetCategory(category)) {
        updateAsset(category, key, value as never)
      }
    },
  })

  return { selectedItem }
}
