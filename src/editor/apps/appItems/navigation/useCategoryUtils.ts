// src/editor/apps/appItems/navigation/useCategoryUtils.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType } from '@/types/OmikujiData'
import { isDev } from '@/types/env'
import { DisplayMetaLucide } from '@/editor/types/DisplayMeta'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { categoryMap } from '@/maps/OmikujiData'
import { useGetRecordData } from '@/editor/stores/useGetRecordData'

export const useCategoryUtils = () => {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { getCategoryArray } = useGetRecordData()

  /**
   * ナビゲーションのアイテム数バッジ表示
   */
  const getCategoryItemCount = (category: CategoryType): number => {
    // if (category === 'dataPacks') return 0 // TODO:いつか「パッケージ数」を取得できるようにする
    if (category === 'appInfo' || category === 'ui') return 0
    if (category === 'jsonMerge') return data.value.jsonMerge.length
    return getCategoryArray(category).length
  }

  /**
   * ナビゲーションの表示・非表示設定
   */
  const filteredCategoryLabels = computed<Record<CategoryType, DisplayMetaLucide>>(() => {
    const { events, assets } = data.value.settings.generator.usage

    const excludeKeys: CategoryType[] = []

    // 開発者のみの機能
    if (!isDev) excludeKeys.push('jsonMerge')

    // イベント関連
    if (!events.comments) excludeKeys.push('comments')
    if (!events.timers) excludeKeys.push('timers')
    if (!events.services) excludeKeys.push('services')
    if (!events.reactions) excludeKeys.push('reactions')

    // アセット関連
    if (!assets.mikuji) excludeKeys.push('mikuji')
    if (!assets.actions) excludeKeys.push('actions')
    if (!assets.placeholders) excludeKeys.push('placeholders')
    if (!assets.characters) excludeKeys.push('characters')

    return Object.fromEntries(
      Object.entries(categoryMap).filter(([key]) => !excludeKeys.includes(key as CategoryType))
    ) as Record<CategoryType, (typeof categoryMap)[CategoryType]>
  })

  return {
    getCategoryItemCount,
    filteredCategoryLabels,
  }
}
