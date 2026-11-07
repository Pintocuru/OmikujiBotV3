// src/editor/helpers/shared/useWeightValueManagement.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { WeightValueType, WeightValueSchema, handleNormalizedValues, WeightValuesArrayType } from '@/types/OmikujiData'
import { calcWeightPercentages } from '@/engine/DrawOmikuji/DrawOmikuji'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { checkCircularReference } from './checkCircularReference'

/**
 * 重み付き値を管理するコンポーザブル
 * scenarioCall と Placeholder 両方で使用可能
 */
export function useWeightValueManagement(values: () => WeightValuesArrayType, currentKey?: () => string | undefined) {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 正規化（string → WeightValueType）
  const displayValues = computed(() => handleNormalizedValues(values()))

  // 各値の出現確率(%)。displayValues と同じ順。抽選(drawByWeight)と同じ計算
  const percentages = computed(() => calcWeightPercentages(displayValues.value))

  // シナリオ一覧（scenarioCall用）
  const availableScenarios = computed(() => {
    if (!data.value?.assets.scenarios) return []

    const current = currentKey?.()

    return Object.entries(data.value.assets.scenarios).map(([key, scenario]) => {
      const circularPath = checkCircularReference(key, data.value.assets.scenarios, current)

      return {
        key,
        name: scenario.name || key,
        disabled: circularPath !== null || key === current,
        circularPath,
      }
    })
  })

  // 値の追加
  const addValue = (emitUpdate: (values: WeightValuesArrayType) => void) => {
    const newValue = WeightValueSchema.parse({})
    emitUpdate([...values(), newValue])
  }

  // 値の削除
  const removeValue = (index: number, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const updated = values().filter((_, i) => i !== index)
    emitUpdate(updated)
  }

  // 値の複製
  const duplicateValue = (index: number, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const original = values()[index]
    let duplicated: string | WeightValueType

    if (typeof original === 'string') {
      duplicated = original
    } else {
      duplicated = { ...original }
    }

    const updated = [...values()]
    updated.splice(index + 1, 0, duplicated)
    emitUpdate(updated)
  }

  // 重み更新
  const updateWeight = (index: number, event: Event, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const weight = parseInt((event.target as HTMLInputElement).value) || 1
    updateValue(index, { weight }, emitUpdate)
  }

  // content 更新
  const updateContent = (index: number, event: Event, emitUpdate: (values: WeightValuesArrayType) => void) => {
    const content = (event.target as HTMLInputElement).value || (event.target as HTMLSelectElement).value
    updateValue(index, { content }, emitUpdate)
  }

  // 値の更新（string → object 変換含む）
  const updateValue = (
    index: number,
    updates: Partial<WeightValueType>,
    emitUpdate: (values: WeightValuesArrayType) => void
  ) => {
    const updated = [...values()]
    const current = updated[index]

    if (typeof current === 'string') {
      updated[index] = { content: current, weight: 1, ...updates }
    } else {
      updated[index] = { ...current, ...updates }
    }

    emitUpdate(updated)
  }

  // 循環参照チェック（scenarioCall用）
  const isCircular = (key: string) => {
    if (!key || !data.value?.assets.scenarios) return false
    const current = currentKey?.()
    return checkCircularReference(key, data.value.assets.scenarios, current) !== null
  }

  const getCircularPath = (key: string) => {
    if (!key || !data.value?.assets.scenarios) return ''
    const current = currentKey?.()
    const path = checkCircularReference(key, data.value.assets.scenarios, current)
    if (!path) return ''
    return path.map((k) => data.value?.assets.scenarios[k]?.name || k).join(' → ')
  }

  return {
    displayValues,
    percentages,
    availableScenarios,
    addValue,
    removeValue,
    duplicateValue,
    updateWeight,
    updateContent,
    isCircular,
    getCircularPath,
  }
}
