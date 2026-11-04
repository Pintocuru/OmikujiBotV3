// src/editor/content/composables/useLaneItems.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import type { LinkItem } from '@/editor/helpers/referenceGraph/types'

/** 選択中のアイテムの key から、接続表示(Lane)に並べるチップを求める。未選択のときは空 */
export const useLaneItems = (find: (selectedKey: string) => LinkItem[]) => {
  const { selectedItemKey } = storeToRefs(useNavigationStore())
  return computed<LinkItem[]>(() => (selectedItemKey.value ? find(selectedItemKey.value) : []))
}
