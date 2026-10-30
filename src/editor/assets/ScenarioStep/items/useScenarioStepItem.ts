// src/editor/assets/ScenarioStep/items/useScenarioStepItem.ts
import { computed, ref } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import type { ScenarioStepKind, ScenarioStepType } from '@/types/OmikujiData'
import { createDefaultStep } from './createDefaultStep'
import { stepSchemaMap, settingsComponentMap } from './scenarioStepKinds'

type Props = { step: ScenarioStepType; currentKey?: string }
type Emit = (event: 'update:step', value: ScenarioStepType) => void

export const useScenarioStepItem = (props: Props, emit: Emit) => {
  const omikujiStore = useOmikujiStore()
  const basicDelaySeconds = computed(() => omikujiStore.data.settings.generator.basicDelaySeconds ?? 1)

  // 現在表示する設定コンポーネント
  const currentComponent = computed(() => settingsComponentMap[props.step.kind])

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

  const updateStepType = (newKind: ScenarioStepKind) => {
    const current = props.step
    if (current.kind === newKind) return

    rawStepCache.value[current.kind] = { ...current }

    const restored = rawStepCache.value[newKind] ?? createDefaultStep(newKind, current.delaySeconds)

    emit(
      'update:step',
      stepSchemaMap[newKind].parse({ ...restored, kind: newKind, delaySeconds: current.delaySeconds })
    )
  }

  // IconRadioGroup の v-model 用
  const kind = computed<ScenarioStepKind>({
    get: () => props.step.kind,
    set: updateStepType,
  })

  const handleStepUpdate = (updated: ScenarioStepType) => emit('update:step', updated)

  return { basicDelaySeconds, currentComponent, componentProps, delaySeconds, kind, handleStepUpdate }
}
