// src/ui/DeadAir/editor/useDeadAirPreview.ts
import { reactive, ref, type Ref } from 'vue'
import type { DeadAirType } from '@/types/ui'
import { useDeadAirLogic } from '../composables/useDeadAirLogic'

/** プレビューで選べる倍速 */
export const DEAD_AIR_PREVIEW_SPEEDS = [1, 10] as const

/**
 * エディタのプレビュー用。本番と同じ useDeadAirLogic を、仮のカウンターと倍速つきで動かす。
 * 本番のストアやカウンターには触れない。
 */
export function useDeadAirPreview(settings: Ref<DeadAirType>) {
  const speed = ref<number>(DEAD_AIR_PREVIEW_SPEEDS[0])
  const counters = reactive<Record<string, number>>({})
  const logic = useDeadAirLogic(settings, counters, speed)

  /** 仮カウンターを amount だけ増やす(イベントルールの動作確認用) */
  const bump = (key: string, amount: number) => {
    counters[key] = (counters[key] ?? 0) + amount
  }

  /** 最初からやり直す(仮カウンターも 0 に戻す) */
  const restart = () => {
    for (const key of Object.keys(counters)) delete counters[key]
    logic.reset()
  }

  return { speed, counters, bump, restart, ...logic }
}
