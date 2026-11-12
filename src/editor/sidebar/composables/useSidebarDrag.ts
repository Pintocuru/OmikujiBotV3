// src/editor/sidebar/composables/useSidebarDrag.ts
import { computed, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType, DataCategoryType } from '@/types/OmikujiData/'
import { DraggableSubItem } from '@/editor/types/apps'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useCategoryOpen } from './useCategoryOpen'
import i18n from '@/editor/i18n'
import { BaseRecordType } from '@/types/core'

export const useSidebarDrag = () => {
  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)
  const { isOpenCategory } = useCategoryOpen()
  const { getEvents, isEventCategory } = useGetEventData()
  const { getAssets, isAssetCategory } = useGetAssetData()
  const omikujiStore = useOmikujiStore()

  const draggableItems = ref<Partial<Record<DataCategoryType, DraggableSubItem[]>>>({})

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

  // 一覧の元になるカテゴリ = 表示中のカテゴリ + サイドバーで開いているカテゴリ
  // (開くだけで表示は切り替わらないため、開いているカテゴリの配列も作っておく必要がある)
  const targetCategories = computed<DataCategoryType[]>(() => {
    const keys = [
      selectedCategory.value,
      ...(Object.keys(isOpenCategory.value) as CategoryType[]).filter((k) => isOpenCategory.value[k]),
    ]
    const result: DataCategoryType[] = []
    for (const key of keys) {
      if ((isEventCategory(key) || isAssetCategory(key)) && !result.includes(key)) result.push(key)
    }
    return result
  })

  const rebuild = () => {
    for (const cat of targetCategories.value) draggableItems.value[cat] = buildDraggableItems(cat)
  }

  // 対象カテゴリが変わったとき(表示の切り替え・一覧の開閉)に配列を再構築
  watch(targetCategories, rebuild, { immediate: true })

  // ストアのデータ変更（追加・削除・名前変更・並び替え）に追従
  watch(() => targetCategories.value.map((cat) => (isEventCategory(cat) ? getEvents(cat) : getAssets(cat))), rebuild, {
    deep: true,
  })

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

  return { draggableItems, onDragEnd }
}
