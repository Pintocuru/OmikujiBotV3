// src/ui/counter/CookieCounter/composables/useStreamCounterDisplay.ts
import { computed, type Ref } from 'vue'
import type { CookieCounterType } from '@/types/ui'
import type { CharacterColorType } from '@/types/OmikujiData/'

/**
 * 表示するカウンターのキー(counters 配列の target の順)
 */
export function useStreamCounterDisplay(settings: Ref<CookieCounterType>) {
  const allKeys = computed(() => settings.value.counters.map((c) => c.target))

  return { allKeys }
}

/** 数値の桁区切り */
export const formatCounterValue = (v: number) => new Intl.NumberFormat().format(v)

/** index 番目のカウンターに割り当てる配色(足りない分は先頭から繰り返す) */
export const pickCounterColor = (colors: CharacterColorType[], index: number): CharacterColorType =>
  colors[index % colors.length]
