// src/editor/apps/navigation/composables/useSidebarCreate.ts
import { useI18n } from 'vue-i18n'
import { CategoryType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

/**
 * サイドバーからの新規作成
 * Events / Assets のカテゴリに、スキーマの既定値で空のデータを1件追加し、そのデータを選択する
 */
export const useSidebarCreate = () => {
  const { t } = useI18n()
  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()
  const { isEventCategory } = useGetEventData()
  const { isAssetCategory } = useGetAssetData()

  const categoryLabel = (category: CategoryType) => t(`categories.${category}.label`)

  /** 新規作成できるカテゴリか（Events / Assets のみ） */
  const canCreate = (category: CategoryType) => isEventCategory(category) || isAssetCategory(category)

  /** 新規作成 → 作成したデータを選択 */
  const createItem = (category: CategoryType): string | null => {
    const name = t('navigation.create.defaultName', { category: categoryLabel(category) })

    // Events は id、Assets は key が「選択キー」になる（addEvent / addAsset の戻り値と一致）
    let newKey: string | null = null
    if (isEventCategory(category)) {
      newKey = omikujiStore.addEvent(category, { name })
    } else if (isAssetCategory(category)) {
      newKey = omikujiStore.addAsset(category, { name })
    }
    if (!newKey) return null

    navigationStore.selectItem(newKey, 'baseSettings')
    swalToast.success({ title: t('navigation.create.success', { name }) })
    return newKey
  }

  return { canCreate, categoryLabel, createItem }
}
