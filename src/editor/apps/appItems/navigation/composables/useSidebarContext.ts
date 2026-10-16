// src/editor/apps/appItems/navigation/composables/useSidebarContext.ts
import { provide, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { SidebarContext } from '@/editor/types/apps'

// Symbol キー
const SIDEBAR_CONTEXT_KEY = Symbol('sidebarContext')

// Provider（NavigationSidebarCategories で1回だけ呼ぶ）
export const provideSidebarContext = () => {
  const { selectedItemKey, activeSection } = storeToRefs(useNavigationStore())

  provide(SIDEBAR_CONTEXT_KEY, {
    selectedItemKey,
    activeSection,
  } satisfies SidebarContext)
}

// Consumer（子孫コンポーネントで呼ぶ）
export const useSidebarContext = (): SidebarContext => {
  const ctx = inject<SidebarContext>(SIDEBAR_CONTEXT_KEY)
  if (!ctx) throw new Error('useSidebarContext: provideSidebarContext が呼ばれていません')
  return ctx
}
