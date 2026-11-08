// src/ui/LifeHourglass/composables/useBowlEntries.ts
import { computed, type Ref } from 'vue'
import {
  LIFE_HOURGLASS_BOWLS,
  LIFE_HOURGLASS_DOME_COUNT_THRESHOLD,
  LIFE_HOURGLASS_MAX_BOWL_ICONS,
  type BowlCounts,
  type LifeHourglassBowlId,
} from './bowls'

export type BowlEntry = { key: string; bowlId: LifeHourglassBowlId; icon: string; label?: string }

/** 器のアイコン一覧。大きい器から並べ、上限を超えた分(小さい器)は省略する */
export const useBowlEntries = (counts: Ref<BowlCounts>) => {
  const entries = computed<BowlEntry[]>(() => {
    const list: BowlEntry[] = []
    for (const bowl of LIFE_HOURGLASS_BOWLS) {
      const count = counts.value[bowl.id]
      // 東京ドームが多いときは数字表記に切り替える(増え続けるのは東京ドームだけ)
      if (bowl.id === 'tokyoDome' && count >= LIFE_HOURGLASS_DOME_COUNT_THRESHOLD) {
        list.push({ key: `${bowl.id}-summary`, bowlId: bowl.id, icon: bowl.icon, label: `× ${count}` })
        continue
      }
      for (let n = 1; n <= count; n++) list.push({ key: `${bowl.id}-${n}`, bowlId: bowl.id, icon: bowl.icon })
    }
    return list
  })

  const visibleBowls = computed(() => entries.value.slice(0, LIFE_HOURGLASS_MAX_BOWL_ICONS))
  const hasHiddenBowls = computed(() => entries.value.length > LIFE_HOURGLASS_MAX_BOWL_ICONS)

  return { visibleBowls, hasHiddenBowls }
}
