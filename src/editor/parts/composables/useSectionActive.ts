// src/editor/parts/composables/useSectionActive.ts
// SectionTabs で選択中のタブと、sectionKey が一致するか(sectionKey 省略時は常に true)
import { computed, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'

export const useSectionActive = (sectionKey: Ref<string | undefined>) => {
  const { activeSection } = storeToRefs(useNavigationStore())
  return computed(() => !sectionKey.value || activeSection.value === sectionKey.value)
}
