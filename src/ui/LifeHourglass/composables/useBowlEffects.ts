// src/ui/LifeHourglass/composables/useBowlEffects.ts
import { onUnmounted, ref, watch, type Ref } from 'vue'
import { LIFE_HOURGLASS_BOWLS, type BowlCounts, type LifeHourglassBowlId } from './bowls'

const EFFECT_MS = 700

/** 一定時間だけ値を持つ ref */
const useTimedId = () => {
  const id = ref<LifeHourglassBowlId | null>(null)
  let timer: ReturnType<typeof setTimeout> | null = null
  const set = (value: LifeHourglassBowlId) => {
    id.value = value
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      id.value = null
    }, EFFECT_MS)
  }
  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })
  return { id, set }
}

/** 器の合体(膨らむ)・落ちる演出 */
export const useBowlEffects = (counts: Ref<BowlCounts>) => {
  const merged = useTimedId()
  const dropped = useTimedId()

  watch(counts, (now, before) => {
    const list = LIFE_HOURGLASS_BOWLS
    // 合体: 下の器が減って上の器が増えたら、上の器を膨らませる
    for (let i = 1; i < list.length; i++) {
      if (now[list[i].id] < before[list[i].id] && now[list[i - 1].id] > before[list[i - 1].id]) {
        merged.set(list[i - 1].id)
        return
      }
    }
    // 合体でなければ、増えた最小の器を落ちる演出に
    for (let i = list.length - 1; i >= 0; i--) {
      if (now[list[i].id] > before[list[i].id]) {
        dropped.set(list[i].id)
        return
      }
    }
  })

  /** ギフト時: 持っている最小の器へ落ちる演出 */
  const dropToSmallest = () => {
    const list = LIFE_HOURGLASS_BOWLS
    for (let i = list.length - 1; i >= 0; i--) {
      if (counts.value[list[i].id] > 0) {
        dropped.set(list[i].id)
        return
      }
    }
  }

  return { mergedBowlId: merged.id, droppedBowlId: dropped.id, dropToSmallest }
}
