// src/editor/stores/useTagSuggestions.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { assetCategory, eventCategory } from '@/types/OmikujiData'
import type { BaseRecordType } from '@/types/core'
import { useOmikujiStore } from './useOmikujiStore'

/**
 * 全データ(events + assets)で使われているタグを、使用回数の多い順に返す
 */
export function useTagSuggestions() {
  const { data } = storeToRefs(useOmikujiStore())

  const allTags = computed<string[]>(() => {
    const count = new Map<string, number>()
    const add = (items: BaseRecordType[]) => {
      for (const item of items) {
        for (const tag of item.tags ?? []) count.set(tag, (count.get(tag) ?? 0) + 1)
      }
    }

    for (const c of eventCategory) add(data.value.events[c] as BaseRecordType[])
    for (const c of assetCategory) add(Object.values(data.value.assets[c]) as BaseRecordType[])

    return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja')).map(([tag]) => tag)
  })

  return { allTags }
}
