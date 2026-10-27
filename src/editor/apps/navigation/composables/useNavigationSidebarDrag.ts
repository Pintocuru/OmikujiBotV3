// src/editor/apps/navigation/composables/useNavigationSidebarDrag.ts
import { Ref, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { DataCategoryType } from '@/types/OmikujiData/'
import { DraggableSubItem } from '@/editor/types/apps'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import i18n from '@/editor/i18n'
import { BaseRecordType } from '@/types/core'

export const useNavigationSidebarDrag = (isExpanded: Readonly<Ref<boolean>>) => {
  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)
  const { getEvents, isEventCategory } = useGetEventData()
  const { getAssets, isAssetCategory } = useGetAssetData()
  const omikujiStore = useOmikujiStore()

  const draggableItems = ref<Partial<Record<DataCategoryType, DraggableSubItem[]>>>({})
  const isDragEnabled = ref(false)

  // 戻り値型を明示して ts(2589) を止める。引数は最小の構造型にする
  const toDraggable = (key: string, item: BaseRecordType): DraggableSubItem => ({
    key,
    label: item.name || i18n.global.t('navigation.unnamed'),
    isEnabled: item.isEnabled,
    rawItem: item,
  })

  const buildDraggableItems = (category: DataCategoryType): DraggableSubItem[] => {
    if (isEventCategory(category)) {
      return getEvents(category).map((item) => toDraggable(item.id, item))
    }
    // assets は Record なので、BaseRecordSchema.order の昇順で並べる(同値は元の順を維持)
    return Object.values(getAssets(category))
      .sort((a, b) => a.order - b.order)
      .map((item) => toDraggable(item.key, item))
  }

  // カテゴリ切り替え・展開時に配列を再構築
  watch(
    [selectedCategory, isExpanded],
    ([cat, expanded]) => {
      if (!expanded) return
      if (!isEventCategory(cat) && !isAssetCategory(cat)) return
      draggableItems.value[cat] = buildDraggableItems(cat)
    },
    { immediate: true }
  )

  // ストアのデータ変更（追加・削除・名前変更・並び替え）に追従
  watch(
    () => {
      const cat = selectedCategory.value
      if (isEventCategory(cat)) return getEvents(cat)
      if (isAssetCategory(cat)) return getAssets(cat)
      return null
    },
    () => {
      const cat = selectedCategory.value
      if (!isEventCategory(cat) && !isAssetCategory(cat)) return
      draggableItems.value[cat] = buildDraggableItems(cat)
    },
    { deep: true }
  )

  // 並び替え: events は配列順、assets は order プロパティに反映する
  const onDragEnd = async (category: DataCategoryType) => {
    const orderedKeys = (draggableItems.value[category] ?? []).map((i) => i?.key).filter((k): k is string => !!k)
    if (orderedKeys.length === 0) return

    await nextTick()
    if (isEventCategory(category)) {
      omikujiStore.reorderEvents(category, orderedKeys)
    } else {
      omikujiStore.reorderAssets(category, orderedKeys)
    }
  }

  return { draggableItems, onDragEnd, isDragEnabled }
}
