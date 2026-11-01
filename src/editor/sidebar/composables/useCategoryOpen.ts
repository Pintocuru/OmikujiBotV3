// src/editor/sidebar/composables/useCategoryOpen.ts
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType } from '@/types/OmikujiData/'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'

// サブ項目の開閉状態。DataCategories と SettingsCategories で共有するため、モジュール内で1つだけ持つ
// (コンポーネントごとに持つと、もう一方で別カテゴリを選んだあとに戻ったとき、開閉が食い違って2回押さないと開かない)
const isOpenCategory = ref<Record<string, boolean>>({})

/**
 * カテゴリの選択と、サブ項目の開閉状態（データ系・設定系で共通）
 */
export const useCategoryOpen = () => {
  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)

  const navigateCategory = (key: CategoryType) => {
    isOpenCategory.value = { [key]: !isOpenCategory.value[key] }
    navigationStore.selectCategory(key)
  }

  return { selectedCategory, isOpenCategory, navigateCategory }
}
