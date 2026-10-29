// src/editor/assets/PostFlow/items/usePostActionItem.ts
import { computed, ref } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import type { PostFlowKind, PostFlowType } from '@/types/OmikujiData'
import { createDefaultAction } from './createDefaultAction'
import { actionSchemaMap, settingsComponentMap } from './postActionKinds'

type Props = { action: PostFlowType; currentKey?: string }
type Emit = (event: 'update:action', value: PostFlowType) => void

export const usePostActionItem = (props: Props, emit: Emit) => {
  const omikujiStore = useOmikujiStore()
  const basicDelaySeconds = computed(() => omikujiStore.data.settings.generator.basicDelaySeconds ?? 1)

  // 現在表示する設定コンポーネント
  const currentComponent = computed(() => settingsComponentMap[props.action.kind])

  // 動的コンポーネントへ渡す props (currentKey は flowCall だけが受け取る)
  const componentProps = computed(() =>
    props.action.kind === 'flowCall'
      ? { action: props.action as any, currentKey: props.currentKey }
      : { action: props.action as any }
  )

  const delaySeconds = computed({
    get: () => props.action.delaySeconds,
    set: (value) => emit('update:action', { ...props.action, delaySeconds: value }),
  })

  // kind 別の生データキャッシュ (切り替えても入力内容を失わない)
  const rawActionCache = ref<Partial<Record<PostFlowKind, PostFlowType>>>({})

  const updateActionType = (newKind: PostFlowKind) => {
    const current = props.action
    if (current.kind === newKind) return

    rawActionCache.value[current.kind] = { ...current }

    const restored = rawActionCache.value[newKind] ?? createDefaultAction(newKind, current.delaySeconds)

    emit(
      'update:action',
      actionSchemaMap[newKind].parse({ ...restored, kind: newKind, delaySeconds: current.delaySeconds })
    )
  }

  // IconRadioGroup の v-model 用
  const kind = computed<PostFlowKind>({
    get: () => props.action.kind,
    set: updateActionType,
  })

  const handleActionUpdate = (updated: PostFlowType) => emit('update:action', updated)

  return { basicDelaySeconds, currentComponent, componentProps, delaySeconds, kind, handleActionUpdate }
}
