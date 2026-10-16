// src/editor/apps/appItems/navigation/composables/useCategoryUtils.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType, eventCategory, assetCategory } from '@/types/OmikujiData'
import { isDev } from '@/types/env'
import { DisplayMetaLucide } from '@/editor/types/DisplayMeta'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { categoryMap } from '@/maps/OmikujiData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useGetEventData } from '@/editor/stores/useGetEventData'

/**
 * ナビゲーションのグループ（サブラベル）
 * events / assets / ui / その他
 */
export type CategoryGroupId = 'events' | 'assets' | 'ui' | 'other'
export type CategoryGroup = { id: CategoryGroupId; keys: CategoryType[] }

export const useCategoryUtils = () => {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { getAssetCount } = useGetAssetData()
  const { isEventCategory, getEventCount } = useGetEventData()

  /**
   * ナビゲーションのアイテム数バッジ表示
   */
  const getCategoryItemCount = (category: CategoryType): number => {
    // if (category === 'dataPacks') return 0 // TODO:いつか「パッケージ数」を取得できるようにする
    if (category === 'appInfo' || category === 'ui') return 0
    if (category === 'jsonMerge') return data.value.jsonMerge.length
    // 残りは Event か Asset のどちらか
    return isEventCategory(category) ? getEventCount(category) : getAssetCount(category)
  }

  /**
   * ナビゲーションの表示・非表示設定
   */
  const filteredCategoryLabels = computed<Record<CategoryType, DisplayMetaLucide>>(() => {
    const excludeKeys: CategoryType[] = []

    // 開発者のみの機能
    if (!isDev) excludeKeys.push('jsonMerge')

    return Object.fromEntries(
      Object.entries(categoryMap).filter(([key]) => !excludeKeys.includes(key as CategoryType))
    ) as Record<CategoryType, (typeof categoryMap)[CategoryType]>
  })

  /**
   * ナビゲーションのグループ分け
   * 表示対象（filteredCategoryLabels）のみを対象にし、空のグループは返さない
   */
  const categoryGroups = computed<CategoryGroup[]>(() => {
    const visible = Object.keys(filteredCategoryLabels.value) as CategoryType[]
    const pick = (list: readonly string[]) => visible.filter((key) => list.includes(key))

    const events = pick(eventCategory)
    const assets = pick(assetCategory)
    const ui = pick(['ui'])
    const grouped = new Set<CategoryType>([...events, ...assets, ...ui])
    const other = visible.filter((key) => !grouped.has(key)) // jsonMerge / appInfo など

    const groups: CategoryGroup[] = [
      { id: 'events', keys: events },
      { id: 'assets', keys: assets },
      { id: 'ui', keys: ui },
      { id: 'other', keys: other },
    ]
    return groups.filter((group) => group.keys.length > 0)
  })

  return {
    getCategoryItemCount,
    filteredCategoryLabels,
    categoryGroups,
  }
}
