// src/editor/ui/useVisibleUiKinds.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { UiKind } from '@/types/OmikujiData'
import { uiLayoutMap } from '@/maps/OmikujiData'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { getUiEditorEntries } from './uiEditorRegistry'

/** 選択中のレイアウトが使う UI のうち、エントリ(main.ts)で登録済みのもの。UiEditor / タブ / TOPページで共通 */
export const useVisibleUiKinds = () => {
  const { data } = storeToRefs(useOmikujiStore())

  return computed(() => {
    const kinds: readonly UiKind[] = uiLayoutMap[data.value.ui.layout]
    return Object.entries(getUiEditorEntries())
      .filter(([kind]) => kinds.includes(kind as UiKind))
      .map(([kind, entry]) => ({ kind: kind as UiKind, entry }))
  })
}
