// src/ui/StreamCounter/composables/useStreamCounterDisplay.ts
import { computed, type Ref } from 'vue'
import type { StreamCounterType } from '@/types/ui'
import type { CharacterColorType } from '@/types/OmikujiData/'

/**
 * 表示するカウンターのキー(標準 → 評価ブロックの順)
 */
export function useStreamCounterDisplay(settings: Ref<StreamCounterType>) {
  const allKeys = computed(() => [
    ...(settings.value.defaultCounters as string[]),
    ...settings.value.variableCounters.map((c) => c.target),
  ])

  return { allKeys }
}

/** 数値の桁区切り */
export const formatCounterValue = (v: number) => new Intl.NumberFormat().format(v)

/** index 番目のカウンターに割り当てる配色(足りない分は先頭から繰り返す) */
export const pickCounterColor = (colors: CharacterColorType[], index: number): CharacterColorType =>
  colors[index % colors.length]
