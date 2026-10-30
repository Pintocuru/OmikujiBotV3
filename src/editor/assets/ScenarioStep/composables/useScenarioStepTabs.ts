// src/editor/assets/ScenarioStep/composables/useScenarioStepTabs.ts
import { computed, Ref, ref, watch } from 'vue'
import { ScenarioStepMessageSchema, ScenarioStepMessageType, ScenarioStepType } from '@/types/OmikujiData/'
import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'

export function useScenarioStepTabs(
  steps: Ref<ScenarioStepType[]>,
  emit: (event: 'update:steps', steps: ScenarioStepType[]) => void
) {
  const { characterArray } = useCharacterLookup()

  // アクティブなタブのインデックス。-1 は「ステップが0件」を表す
  const activeTab = ref(steps.value.length > 0 ? 0 : -1)

  // 現在選択されているアクション
  const currentStep = computed(() => (activeTab.value >= 0 ? (steps.value[activeTab.value] ?? null) : null))

  // タブの切り替え（閉じる概念はなし。常に開いたまま）
  const setActiveTab = (index: number) => {
    if (index >= 0 && index < steps.value.length) {
      activeTab.value = index
    }
  }

  const updateCurrentStep = (updatedStep: ScenarioStepType) => {
    if (activeTab.value < 0) return
    const newSteps = [...steps.value]
    newSteps[activeTab.value] = updatedStep
    emit('update:steps', newSteps)
  }

  const addNewStep = () => {
    const newStep: ScenarioStepMessageType = ScenarioStepMessageSchema.parse({
      characterKey: characterArray.value[0]?.key ?? null,
      delaySeconds: steps.value.length > 0 ? Math.max(...steps.value.map((a) => a.delaySeconds)) + 1 : 0,
    })
    const newSteps = [...steps.value, newStep]
    emit('update:steps', newSteps)
    activeTab.value = newSteps.length - 1
  }

  const duplicateStep = (index: number) => {
    if (index < 0 || index >= steps.value.length) return
    const actionToDuplicate = { ...steps.value[index] }
    actionToDuplicate.delaySeconds += 0.5
    const newSteps = [...steps.value]
    newSteps.splice(index + 1, 0, actionToDuplicate)
    emit('update:steps', newSteps)
    activeTab.value = index + 1
  }

  const removeStep = (index: number) => {
    if (index < 0 || index >= steps.value.length) return
    const newSteps = steps.value.filter((_, i) => i !== index)
    emit('update:steps', newSteps)

    if (newSteps.length === 0) {
      activeTab.value = -1
    } else if (activeTab.value === index) {
      // 削除したタブを選択していた → 同じ位置 or 末尾に寄せる
      activeTab.value = Math.min(index, newSteps.length - 1)
    } else if (activeTab.value > index) {
      activeTab.value -= 1
    }
  }

  const followReorder = (order: number[]) => {
    if (activeTab.value < 0) return
    const next = order.indexOf(activeTab.value)
    if (next >= 0) activeTab.value = next
  }

  // 選択中インデックスが範囲外になったら補正するだけ
  watch(
    () => steps.value.length,
    (len) => {
      if (len === 0) {
        activeTab.value = -1
      } else if (activeTab.value >= len) {
        activeTab.value = len - 1
      } else if (activeTab.value < 0) {
        // 0件→1件以上になったら先頭を選択（初回追加時など）
        activeTab.value = 0
      }
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
    followReorder,
  }
}
