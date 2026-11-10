// src/editor/sidebar/composables/useCategoryOpen.ts
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType } from '@/types/OmikujiData/'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'

// サブ項目の開閉状態。DataCategories と SettingsCategories で共有するため、モジュール内で1つだけ持つ
const isOpenCategory = ref<Record<string, boolean>>({})

/**
 * カテゴリの選択と、サブ項目の開閉状態（データ系・設定系で共通）
 */
export const useCategoryOpen = () => {
  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)

  // 設定カテゴリなど、カテゴリ自体のページへ移動する場合に使用
  const navigateCategory = (key: CategoryType) => {
    isOpenCategory.value[key] = !isOpenCategory.value[key]
    navigationStore.selectCategory(key)
  }

  // データカテゴリの一覧だけを開閉する。ContentArea の選択状態には触れない
  const toggleCategoryList = (key: CategoryType) => {
    isOpenCategory.value[key] = !isOpenCategory.value[key]
  }

  /** 指定カテゴリのサブ項目を開く。ほかのカテゴリの開閉状態は維持する */
  const revealCategory = (key: CategoryType) => {
    isOpenCategory.value[key] = true
  }

  return { selectedCategory, isOpenCategory, navigateCategory, toggleCategoryList, revealCategory }
}
