// src/editor/ui/useVisibleUiKinds.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { UiKind } from '@/types/OmikujiData'
import { uiLayoutMap } from '@/ui/uiLayoutMap'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { getUiEditorEntries } from './uiEditorRegistry'

/** 選択中のレイアウトが使う UI のうち、エントリ(main.ts)で登録済みのもの。UiEditor / タブ / TOPページで共通 */
export const useVisibleUiKinds = () => {
  const { data } = storeToRefs(useOmikujiStore())

  return computed(() => {
    const kinds: readonly UiKind[] = uiLayoutMap[data.value.ui.layout]
    const entries = getUiEditorEntries()
    return (Object.keys(entries) as UiKind[])
      .filter((kind) => kinds.includes(kind) && entries[kind] !== undefined)
      .map((kind) => ({ kind, entry: entries[kind]! }))
  })
}
