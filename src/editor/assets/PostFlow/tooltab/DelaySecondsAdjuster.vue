<!-- src/editor/assets/PostFlow/tooltab/DelaySecondsAdjuster.vue -->
<template>
  <div class="flex gap-1 items-center pr-2">
    <button
      @click="adjustAllDelaySeconds(-0.1)"
      class="btn btn-sm btn-ghost tooltip tooltip-top"
      :data-tip="t('postFlow.delay.decreaseTip')"
      :disabled="modelValue.length === 0 || !canDecreaseDelay"
      type="button"
    >
      <Minus :size="16" />
    </button>
    <span class="text-xs text-base-content/70">{{ t('postFlow.delay.label') }}</span>
    <button
      @click="adjustAllDelaySeconds(0.1)"
      class="btn btn-sm btn-ghost tooltip tooltip-top"
      :data-tip="t('postFlow.delay.increaseTip')"
      :disabled="modelValue.length === 0"
      type="button"
    >
      <Plus :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { PostFlowType } from '@/types/OmikujiData/'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { Minus, Plus } from 'lucide-vue-next'

  // Props
  const { t } = useI18n()

  const props = defineProps<{
    modelValue: PostFlowType[]
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: PostFlowType[]]
  }>()

  // 下限値
  const omikujiStore = useOmikujiStore()
  const minDelaySeconds = computed(() => omikujiStore.data.settings.generator.basicDelaySeconds * -1)

  // 減らすボタンが有効かどうかをチェック
  const canDecreaseDelay = computed(() => {
    if (props.modelValue.length === 0) return false
    // 全てのdelaySecondsが下限より大きいかチェック
    return props.modelValue.some((action) => action.delaySeconds > minDelaySeconds.value)
  })

  // 全てのdelaySecondsを調整する関数
  const adjustAllDelaySeconds = (adjustment: number) => {
    const updatedActions = props.modelValue.map((action) => {
      const newDelay = Math.round((action.delaySeconds + adjustment) * 10) / 10
      // 下限チェック
      const clampedDelay = Math.max(newDelay, minDelaySeconds.value)
      return {
        ...action,
        delaySeconds: clampedDelay,
      }
    })

    // delaySecondsでソート（小さい順）
    updatedActions.sort((a, b) => a.delaySeconds - b.delaySeconds)

    emit('update:modelValue', updatedActions)
  }
</script>
