<!-- src/editor/assets/scenarios/tooltab/DelaySecondsAdjuster.vue -->
<template>
  <div class="flex gap-1 items-center pr-2">
    <button
      @click="adjustAllDelaySeconds(-0.1)"
      class="btn btn-sm btn-ghost btn-square tooltip tooltip-top"
      :data-tip="t('scenarioStep.delay.decreaseTip')"
      :aria-label="t('scenarioStep.delay.decreaseTip')"
      :disabled="steps.length === 0 || !canDecreaseDelay"
      type="button"
    >
      <Minus class="w-4 h-4" />
    </button>
    <span class="text-xs text-base-content/70">{{ t('scenarioStep.delay.label') }}</span>
    <button
      @click="adjustAllDelaySeconds(0.1)"
      class="btn btn-sm btn-ghost btn-square tooltip tooltip-top"
      :data-tip="t('scenarioStep.delay.increaseTip')"
      :aria-label="t('scenarioStep.delay.increaseTip')"
      :disabled="steps.length === 0"
      type="button"
    >
      <Plus class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { ScenarioStepRecordType } from '@/types/OmikujiData/'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { Minus, Plus } from 'lucide-vue-next'

  // Props
  const { t } = useI18n()

  const props = defineProps<{
    modelValue: ScenarioStepRecordType
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: ScenarioStepRecordType]
  }>()

  const steps = computed(() => Object.values(props.modelValue))

  // 下限値
  const omikujiStore = useOmikujiStore()
  const minDelaySeconds = computed(() => omikujiStore.data.settings.generator.basicDelaySeconds * -1)

  // 減らすボタンが有効かどうかをチェック
  const canDecreaseDelay = computed(() => {
    if (steps.value.length === 0) return false
    // 全てのdelaySecondsが下限より大きいかチェック
    return steps.value.some((step) => step.delaySeconds > minDelaySeconds.value)
  })

  // 全てのdelaySecondsを調整する関数(id は変えない。並びは表示時に sort されるので、ここでは並べ替えない)
  const adjustAllDelaySeconds = (adjustment: number) => {
    const adjusted: ScenarioStepRecordType = {}
    for (const [id, step] of Object.entries(props.modelValue)) {
      const newDelay = Math.round((step.delaySeconds + adjustment) * 10) / 10
      // 下限チェック
      adjusted[id] = { ...step, delaySeconds: Math.max(newDelay, minDelaySeconds.value) }
    }
    emit('update:modelValue', adjusted)
  }
</script>
