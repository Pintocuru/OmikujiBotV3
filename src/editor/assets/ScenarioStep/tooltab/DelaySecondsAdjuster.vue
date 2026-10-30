<!-- src/editor/assets/ScenarioStep/tooltab/DelaySecondsAdjuster.vue -->
<template>
  <div class="flex gap-1 items-center pr-2">
    <button
      @click="adjustAllDelaySeconds(-0.1)"
      class="btn btn-sm btn-ghost tooltip tooltip-top"
      :data-tip="t('scenarioStep.delay.decreaseTip')"
      :disabled="modelValue.length === 0 || !canDecreaseDelay"
      type="button"
    >
      <Minus :size="16" />
    </button>
    <span class="text-xs text-base-content/70">{{ t('scenarioStep.delay.label') }}</span>
    <button
      @click="adjustAllDelaySeconds(0.1)"
      class="btn btn-sm btn-ghost tooltip tooltip-top"
      :data-tip="t('scenarioStep.delay.increaseTip')"
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
  import { ScenarioStepType } from '@/types/OmikujiData/'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { Minus, Plus } from 'lucide-vue-next'

  // Props
  const { t } = useI18n()

  const props = defineProps<{
    modelValue: ScenarioStepType[]
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: ScenarioStepType[]]
    /** ソート後の並び。order[新index] = 元のindex(選択中タブの追従用) */
    reorder: [order: number[]]
  }>()

  // 下限値
  const omikujiStore = useOmikujiStore()
  const minDelaySeconds = computed(() => omikujiStore.data.settings.generator.basicDelaySeconds * -1)

  // 減らすボタンが有効かどうかをチェック
  const canDecreaseDelay = computed(() => {
    if (props.modelValue.length === 0) return false
    // 全てのdelaySecondsが下限より大きいかチェック
    return props.modelValue.some((step) => step.delaySeconds > minDelaySeconds.value)
  })

  // 全てのdelaySecondsを調整する関数
  const adjustAllDelaySeconds = (adjustment: number) => {
    const adjusted = props.modelValue.map((step, originalIndex) => {
      const newDelay = Math.round((step.delaySeconds + adjustment) * 10) / 10
      // 下限チェック
      const clampedDelay = Math.max(newDelay, minDelaySeconds.value)
      return {
        originalIndex,
        step: {
          ...step,
          delaySeconds: clampedDelay,
        },
      }
    })

    // delaySecondsでソート（小さい順。同値は元の順序を保つ）
    adjusted.sort((a, b) => a.step.delaySeconds - b.step.delaySeconds)

    emit(
      'update:modelValue',
      adjusted.map((e) => e.step)
    )
    emit(
      'reorder',
      adjusted.map((e) => e.originalIndex)
    )
  }
</script>
