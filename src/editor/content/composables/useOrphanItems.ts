// src/editor/content/composables/useOrphanItems.ts
// 孤立アイテム(イベントから辿れないもの)の検出。events を起点に、みくじ箱 → シナリオ → キャラクター / プレースホルダーと辿る
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { assetCategory, eventCategory, type DataCategoryType } from '@/types/OmikujiData'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useReferenceGraph } from './useReferenceGraph'

export type OrphanItem = { category: DataCategoryType; key: string; name: string }
export type OrphanGroup = { category: DataCategoryType; items: OrphanItem[] }

export function useOrphanItems() {
  const { data } = storeToRefs(useOmikujiStore())
  const { usedKeysFromEvents, isSearching } = useReferenceGraph()

  /** カテゴリごとの孤立アイテム(0 件のカテゴリは含めない) */
  const orphanGroups = computed<OrphanGroup[]>(() => {
    const { events, assets } = data.value
    const used = usedKeysFromEvents()
    const mikujiKeys = new Set(Object.keys(assets.mikuji))

    const groups: OrphanGroup[] = []

    // events: omikujiKey が空、または存在しないみくじ箱を指している
    for (const category of eventCategory) {
      const items = events[category]
        .filter((event) => !event.omikujiKey || !mikujiKeys.has(event.omikujiKey))
        .map((event) => ({ category, key: event.id, name: event.name || event.id }))
      groups.push({ category, items })
    }

    // assets: イベントから辿れない
    for (const category of assetCategory) {
      const items = Object.entries(assets[category] as Record<string, { name?: string }>)
        .filter(([key]) => !used[category].has(key))
        .map(([key, item]) => ({ category, key, name: item.name || key }))
      groups.push({ category, items })
    }

    return groups.filter((group) => group.items.length > 0)
  })

  return { orphanGroups, isSearching }
}
