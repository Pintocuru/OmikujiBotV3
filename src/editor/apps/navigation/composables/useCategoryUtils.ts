// src/editor/apps/navigation/composables/useCategoryUtils.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  CategoryType,
  DataCategoryType,
  SettingsCategoryType,
  EventCategoryType,
  AssetCategoryType,
  eventCategory,
  assetCategory,
} from '@/types/OmikujiData'
import { isDev } from '@/types/env'
import { DisplayMetaLucide } from '@/common/LucideIcon/DisplayMetaLucide'
import { CategoryGroup } from '@/editor/types/apps'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { categoryMap } from '@/maps/OmikujiData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { isFullRegistered } from '@/editor/registrationState'

export const useCategoryUtils = () => {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { getAssetCount } = useGetAssetData()
  const { isEventCategory, getEventCount } = useGetEventData()

  /**
   * ナビゲーションのアイテム数バッジ表示
   */
  const getCategoryItemCount = (category: CategoryType): number => {
    // TODO:いつか dataPacks も「パッケージ数」を取得できるようにする
    if (category === 'appInfo' || category === 'ui' || category === 'dataPacks') return 0
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

    // 全部入り(registerAll)でないビルドでは、全 UI 前提の DataPacks を出さない
    if (!isFullRegistered.value) excludeKeys.push('dataPacks')

    return Object.fromEntries(
      Object.entries(categoryMap).filter(([key]) => !excludeKeys.includes(key as CategoryType))
    ) as Record<CategoryType, (typeof categoryMap)[CategoryType]>
  })

  /** 表示対象のキーから、指定リストに含まれるものだけを取り出す */
  const pick = (list: readonly string[]) =>
    (Object.keys(filteredCategoryLabels.value) as CategoryType[]).filter((key) => list.includes(key))

  /**
   * データ系（DataCategoryType）のグループ分け。空のグループは返さない
   */
  const dataCategoryGroups = computed<CategoryGroup<DataCategoryType>[]>(() => {
    const groups: CategoryGroup<DataCategoryType>[] = [
      { id: 'events', keys: pick(eventCategory) as EventCategoryType[] },
      { id: 'assets', keys: pick(assetCategory) as AssetCategoryType[] },
    ]
    return groups.filter((group) => group.keys.length > 0)
  })

  /**
   * 設定系（SettingsCategoryType）のグループ分け。空のグループは返さない
   */
  const settingsCategoryGroups = computed<CategoryGroup<SettingsCategoryType>[]>(() => {
    const groups: CategoryGroup<SettingsCategoryType>[] = [
      { id: 'ui', keys: pick(['ui']) as SettingsCategoryType[] },
      { id: 'other', keys: pick(['jsonMerge', 'dataPacks', 'appInfo']) as SettingsCategoryType[] }, // 表示順は categoryMap に従う
    ]
    return groups.filter((group) => group.keys.length > 0)
  })

  return {
    getCategoryItemCount,
    filteredCategoryLabels,
    dataCategoryGroups,
    settingsCategoryGroups,
  }
}
