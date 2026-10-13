// src/editor/stores/composables/useEventSort.ts
import { Ref } from 'vue'
import { EventCategoryType, OmikujiDataType } from '@/types/OmikujiData/'

// ids の順に並べ、ids に含まれないものは元の相対順のまま末尾に残す
const sortByIds = <T extends { id: string }>(items: readonly T[], ids: readonly string[]): T[] => {
  const map = new Map(items.map((item) => [item.id, item]))
  const idSet = new Set(ids)
  const sorted = ids.flatMap((id) => {
    const item = map.get(id)
    return item ? [item] : []
  })
  return [...sorted, ...items.filter((item) => !idSet.has(item.id))]
}

/**
 * イベント(配列型)の並び替え機能を提供
 */
export function useEventSort(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  const reorderEvents = (category: EventCategoryType, orderedIds: string[]) => {
    // 配列は共変なので、キャストなしで { id } 配列として扱える
    const list: Array<{ id: string }> = data.value.events[category]
    const sorted = sortByIds(list, orderedIds)

    // 同じ並びなら何もしない（hasChanged を無駄に立てない）
    if (sorted.every((item, i) => item === list[i])) return

    // 配列を差し替えず in-place で並べ替える（参照を保ち、Vue のリアクティビティも維持）
    list.splice(0, list.length, ...sorted)
    hasChanged.value = true
  }

  return { reorderEvents }
}
