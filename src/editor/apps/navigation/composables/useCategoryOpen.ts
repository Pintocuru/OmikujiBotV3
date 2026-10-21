// src/editor/apps/navigation/composables/useCategoryOpen.ts
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType } from '@/types/OmikujiData/'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'

/**
 * カテゴリの選択と、サブ項目の開閉状態（データ系・設定系で共通）
 */
export const useCategoryOpen = () => {
  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)

  const isOpenCategory = ref<Record<string, boolean>>({})

  const navigateCategory = (key: CategoryType) => {
    isOpenCategory.value = { [key]: !isOpenCategory.value[key] }
    navigationStore.selectCategory(key)
  }

  return { selectedCategory, isOpenCategory, navigateCategory }
}
