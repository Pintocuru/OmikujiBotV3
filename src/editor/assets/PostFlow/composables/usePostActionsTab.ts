// src/editor/assets/PostFlow/composables/usePostActionsTab.ts
import { computed, Ref, ref, watch } from 'vue'
import { ScenarioStepMessageSchema, ScenarioStepMessageType, ScenarioStepType } from '@/types/OmikujiData/'
import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'

export function usePostActionsTab(
  actions: Ref<ScenarioStepType[]>,
  emit: (event: 'update:actions', actions: ScenarioStepType[]) => void
) {
  const { characterArray } = useCharacterLookup()

  // アクティブなタブのインデックス。-1 は「ステップが0件」を表す
  const activeTab = ref(actions.value.length > 0 ? 0 : -1)

  // 現在選択されているアクション
  const currentAction = computed(() => (activeTab.value >= 0 ? (actions.value[activeTab.value] ?? null) : null))

  // タブの切り替え（閉じる概念はなし。常に開いたまま）
  const setActiveTab = (index: number) => {
    if (index >= 0 && index < actions.value.length) {
      activeTab.value = index
    }
  }

  const updateCurrentAction = (updatedAction: ScenarioStepType) => {
    if (activeTab.value < 0) return
    const newActions = [...actions.value]
    newActions[activeTab.value] = updatedAction
    emit('update:actions', newActions)
  }

  const addNewAction = () => {
    const newAction: ScenarioStepMessageType = ScenarioStepMessageSchema.parse({
      characterKey: characterArray.value[0]?.key ?? null,
      delaySeconds: actions.value.length > 0 ? Math.max(...actions.value.map((a) => a.delaySeconds)) + 1 : 0,
    })
    const newActions = [...actions.value, newAction]
    emit('update:actions', newActions)
    activeTab.value = newActions.length - 1
  }

  const duplicateAction = (index: number) => {
    if (index < 0 || index >= actions.value.length) return
    const actionToDuplicate = { ...actions.value[index] }
    actionToDuplicate.delaySeconds += 0.5
    const newActions = [...actions.value]
    newActions.splice(index + 1, 0, actionToDuplicate)
    emit('update:actions', newActions)
    activeTab.value = index + 1
  }

  const removeAction = (index: number) => {
    if (index < 0 || index >= actions.value.length) return
    const newActions = actions.value.filter((_, i) => i !== index)
    emit('update:actions', newActions)

    if (newActions.length === 0) {
      activeTab.value = -1
    } else if (activeTab.value === index) {
      // 削除したタブを選択していた → 同じ位置 or 末尾に寄せる
      activeTab.value = Math.min(index, newActions.length - 1)
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
    () => actions.value.length,
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
    currentAction,
    setActiveTab,
    updateCurrentAction,
    addNewAction,
    duplicateAction,
    removeAction,
    followReorder,
  }
}
