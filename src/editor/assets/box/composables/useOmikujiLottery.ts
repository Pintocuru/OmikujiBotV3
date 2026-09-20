// src/editor/assets/box/composables/useOmikujiLottery.ts
import { computed } from 'vue'
import {
  CriteriaThresholdSchema,
  type CriteriaThresholdType,
  type CriteriaThresholdCondition,
  type LotteryType,
  type OmikujiItemType,
} from '@/types/OmikujiData/'

const defaultCriteria = () => CriteriaThresholdSchema.parse({})

export function useOmikujiLottery(getItem: () => OmikujiItemType, emitUpdate: (item: OmikujiItemType) => void) {
  const lottery = computed(() => getItem().lottery)
  const hasCriteria = computed(() => lottery.value.criteria !== null)
  const isPriority = computed(() => lottery.value.isPriority)
  const criteria = computed(() => lottery.value.criteria ?? defaultCriteria())

  const emitLottery = (next: LotteryType) => {
    emitUpdate({ ...getItem(), lottery: next } as OmikujiItemType)
  }

  // 条件なし / 条件あり(通常) に切り替える。優先は必ず解除される
  const setCriteriaEnabled = (enabled: boolean) => {
    emitLottery({
      isPriority: false,
      weight: lottery.value.weight,
      criteria: enabled ? criteria.value : null,
    })
  }

  // 優先 ON/OFF（条件ありのときだけ呼ばれる想定）
  const setPriority = (value: boolean) => {
    const weight = lottery.value.weight
    emitLottery(
      value
        ? { isPriority: true, weight, criteria: criteria.value }
        : { isPriority: false, weight, criteria: criteria.value }
    )
  }

  // criteria の中身だけ差し替える（isPriority はそのまま）
  const setCriteria = (next: CriteriaThresholdType) => {
    const weight = lottery.value.weight
    emitLottery(
      lottery.value.isPriority
        ? { isPriority: true, weight, criteria: next }
        : { isPriority: false, weight, criteria: next }
    )
  }

  const updateCriteriaKey = <K extends keyof CriteriaThresholdType>(key: K, value: CriteriaThresholdType[K]) =>
    setCriteria({ ...criteria.value, [key]: value })

  const toggleCondition = (condition: CriteriaThresholdCondition) => {
    const list = criteria.value.conditions
    setCriteria({
      ...criteria.value,
      conditions: list.includes(condition) ? list.filter((c) => c !== condition) : [...list, condition],
    })
  }

  return { hasCriteria, isPriority, criteria, setCriteriaEnabled, setPriority, updateCriteriaKey, toggleCondition }
}
