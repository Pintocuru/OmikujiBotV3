// src/editor/assets/scenarios/composables/useScenarioStepTabs.ts
import { computed, Ref, ref, watch } from 'vue'
import {
  ScenarioStepMessageSchema,
  ScenarioStepRecordType,
  ScenarioStepType,
  ScenarioStepWithIdType,
  sortedStepsFromRecord,
} from '@/types/OmikujiData/'
import { generateId } from '@/types/core'
import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'

export function useScenarioStepTabs(
  steps: Ref<ScenarioStepRecordType>,
  emit: (event: 'update:steps', steps: ScenarioStepRecordType) => void
) {
  const { characterArray } = useCharacterLookup()

  // 表示順(delaySeconds 昇順)。保存順には依存しない
  const sortedSteps = computed(() => sortedStepsFromRecord(steps.value))

  // アクティブなタブの step id。null は「ステップが0件」を表す
  const activeTab = ref<string | null>(sortedSteps.value[0]?.id ?? null)

  // 現在選択されているステップ
  const currentStep = computed<ScenarioStepWithIdType | null>(() =>
    activeTab.value !== null ? (steps.value[activeTab.value] ?? null) : null
  )

  // タブの切り替え（閉じる概念はなし。常に開いたまま）
  const setActiveTab = (id: string) => {
    if (id in steps.value) activeTab.value = id
  }

  const updateCurrentStep = (updatedStep: ScenarioStepType) => {
    const id = activeTab.value
    if (id === null || !(id in steps.value)) return
    // id は編集中のタブのものを正とする(子コンポーネントが id を落としても保たれる)
    emit('update:steps', { ...steps.value, [id]: { ...updatedStep, id } })
  }

  const addNewStep = () => {
    const id = generateId()
    const newStep: ScenarioStepType = ScenarioStepMessageSchema.parse({
      characterKey: characterArray.value[0]?.key ?? null,
      delaySeconds: sortedSteps.value.length > 0 ? Math.max(...sortedSteps.value.map((a) => a.delaySeconds)) + 1 : 0,
    })
    emit('update:steps', { ...steps.value, [id]: { ...newStep, id } })
    activeTab.value = id
  }

  const duplicateStep = (id: string) => {
    const source = steps.value[id]
    if (!source) return
    const newId = generateId()
    emit('update:steps', { ...steps.value, [newId]: { ...source, id: newId, delaySeconds: source.delaySeconds + 0.5 } })
    activeTab.value = newId
  }

  const removeStep = (id: string) => {
    if (!(id in steps.value)) return
    const before = sortedSteps.value
    const index = before.findIndex((step) => step.id === id)
    const next = { ...steps.value }
    delete next[id]
    emit('update:steps', next)

    if (activeTab.value !== id) return
    // 削除したタブを選択していた → 表示順で同じ位置 or 末尾に寄せる
    const remaining = before.filter((step) => step.id !== id)
    activeTab.value = remaining.length === 0 ? null : remaining[Math.min(index, remaining.length - 1)].id
  }

  // 選択中の id が存在しなくなったら補正する(シナリオ切替・貼り付け上書き・0件→1件以上)
  watch(
    steps,
    (record) => {
      if (activeTab.value !== null && activeTab.value in record) return
      activeTab.value = sortedStepsFromRecord(record)[0]?.id ?? null
    },
    { immediate: true }
  )

  return {
    activeTab,
    currentStep,
    setActiveTab,
    updateCurrentStep,
    addNewStep,
    duplicateStep,
    removeStep,
  }
}
