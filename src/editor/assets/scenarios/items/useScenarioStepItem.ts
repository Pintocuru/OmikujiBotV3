// src/editor/assets/scenarios/items/useScenarioStepItem.ts
import { computed, ref } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import type { ScenarioStepKind, ScenarioStepType, ScenarioStepWithIdType, UiKind } from '@/types/OmikujiData'
import { uiLayoutMap } from '@/maps/OmikujiData/ui'
import { postUiKinds } from '@/types/generator'
import { createDefaultStep } from './createDefaultStep'
import { stepSchemaMap } from './ScenarioStepKindMap'
import { isUiKindChoice, stepToChoice, type StepChoice } from './stepChoice'

type Props = { step: ScenarioStepWithIdType; currentKey?: string }
type Emit = (event: 'update:step', value: ScenarioStepWithIdType) => void

export const useScenarioStepItem = (props: Props, emit: Emit) => {
  const omikujiStore = useOmikujiStore()
  const basicDelaySeconds = computed(() => omikujiStore.data.settings.generator.basicDelaySeconds ?? 1)

  // 動的コンポーネントへ渡す props (currentKey は scenarioCall だけが受け取る)
  const componentProps = computed(() =>
    props.step.kind === 'scenarioCall'
      ? { step: props.step as any, currentKey: props.currentKey }
      : { step: props.step as any }
  )

  const delaySeconds = computed({
    get: () => props.step.delaySeconds,
    set: (value) => emit('update:step', { ...props.step, delaySeconds: value }),
  })

  // kind 別の生データキャッシュ (切り替えても入力内容を失わない)
  const rawStepCache = ref<Partial<Record<ScenarioStepKind, ScenarioStepType>>>({})

  // uiKey: message に切り替える(または message のまま表示先を変える)ときの表示先の UI
  const updateStepType = (newKind: ScenarioStepKind, uiKey?: UiKind) => {
    const current = props.step
    if (current.kind === newKind) {
      const unchanged = current.kind !== 'message' || uiKey === undefined || current.uiKey === uiKey
      if (unchanged) return
    }

    // 同じ kind のまま(message の表示先だけ変える)なら、現在の内容を引き継ぐ
    const restored =
      current.kind === newKind
        ? current
        : (rawStepCache.value[newKind] ?? createDefaultStep(newKind, current.delaySeconds))
    if (current.kind !== newKind) rawStepCache.value[current.kind] = { ...current }

    // schema は id を落とすので、id は現在のステップのものを引き継ぐ(別ステップになってしまわないように)
    emit('update:step', {
      ...stepSchemaMap[newKind].parse({
        ...restored,
        ...(uiKey ? { uiKey } : {}),
        kind: newKind,
        delaySeconds: current.delaySeconds,
      }),
      id: current.id,
    })
  }

  // 表示先の UI: 現在のレイアウトで投稿を受け取れるもの
  // 現在のステップの表示先が含まれない場合(レイアウト変更など)も、選択状態を見せるため末尾に足す
  const selectableUiKinds = computed<UiKind[]>(() => {
    const kinds = uiLayoutMap[omikujiStore.data.ui.layout].filter((kind) => postUiKinds.includes(kind))
    const current = props.step.kind === 'message' ? props.step.uiKey : undefined
    return current && !kinds.includes(current) ? [...kinds, current] : kinds
  })

  // IconRadioGroup の v-model 用 (message は表示先の UI として選ぶ)
  const stepChoice = computed<StepChoice>({
    get: () => stepToChoice(props.step),
    set: (choice) => (isUiKindChoice(choice) ? updateStepType('message', choice) : updateStepType(choice)),
  })

  // 子の設定コンポーネントが id を落としても、現在のステップの id を保つ
  const handleStepUpdate = (updated: ScenarioStepType) => emit('update:step', { ...updated, id: props.step.id })

  return { basicDelaySeconds, componentProps, delaySeconds, stepChoice, selectableUiKinds, handleStepUpdate }
}
