<!-- src/editor/assets/scenarios/tooltab/ScenarioStepToolbar.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label">
        <span class="label-text font-medium"> </span>
      </label>

      <div class="flex gap-2">
        <!-- delaySeconds調整コンポーネント -->
        <DelaySecondsAdjuster :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />

        <!-- テスト投稿ボタン -->
        <button
          @click="() => postTestOmikujiItem(sortedStepsFromRecord(modelValue))"
          class="btn btn-sm btn-neutral tooltip tooltip-top gap-2"
          :data-tip="t('scenarioStep.toolbar.testTip')"
          :disabled="isEmpty"
        >
          <Send class="w-4 h-4" />
          {{ t('scenarioStep.toolbar.test') }}
        </button>

        <!-- JSONコピー -->
        <button
          @click="handleCopy"
          class="btn btn-sm btn-ghost tooltip tooltip-top gap-2"
          :data-tip="t('scenarioStep.toolbar.copyTip')"
          type="button"
          :disabled="clipboard.isCopying.value"
        >
          <ClipboardCopy class="w-4 h-4" />
          {{ t('scenarioStep.toolbar.copy') }}
        </button>

        <!-- JSONペースト -->
        <button
          @click="handlePaste"
          class="btn btn-sm btn-secondary tooltip tooltip-top"
          :data-tip="t('scenarioStep.toolbar.pasteTip')"
          type="button"
          :disabled="clipboard.isPasting.value"
        >
          <ClipboardPaste class="w-4 h-4" />
          {{ t('scenarioStep.toolbar.paste') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ScenarioStepRecordType, ScenarioStepRecordSchema, sortedStepsFromRecord } from '@/types/OmikujiData'
  import { generateId } from '@/types/core'
  import DelaySecondsAdjuster from './DelaySecondsAdjuster.vue'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { useTestPost } from '@/editor/helpers/useTestPost'
  import { Send, ClipboardCopy, ClipboardPaste } from 'lucide-vue-next'
  import { useJsonClipboard } from '@/editor/helpers/useJsonClipboard'

  // Props
  const { t } = useI18n()

  const props = defineProps<{
    modelValue: ScenarioStepRecordType
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: ScenarioStepRecordType]
  }>()

  const { postTestOmikujiItem } = useTestPost()

  const isEmpty = computed(() => Object.keys(props.modelValue).length === 0)

  // 貼り付けるデータに新しい id を振り直す(重複する id で既存ステップを上書きしないため)
  const withFreshIds = (steps: ScenarioStepRecordType): ScenarioStepRecordType =>
    Object.fromEntries(
      Object.values(steps).map((step) => {
        const id = generateId()
        return [id, { ...step, id }]
      })
    )

  // ScenarioStepRecordType 用クリップボード
  const clipboard = useJsonClipboard<ScenarioStepRecordType>({
    parse: (raw) => {
      // 旧形式(ステップの配列)のコピーも貼り付けられるようにする
      const normalized = Array.isArray(raw)
        ? Object.fromEntries(
            raw.map((step) => {
              const id = generateId()
              return [id, { ...step, id }]
            })
          )
        : raw
      const result = ScenarioStepRecordSchema.safeParse(normalized)
      return result.success ? result.data : null
    },
  })

  const handleCopy = async () => {
    await clipboard.copyJson(props.modelValue)
  }

  const handlePaste = async () => {
    const parsed = await clipboard.pasteJson()

    if (parsed === null) {
      swalToast.error({
        title: t('scenarioStep.toolbar.pasteFailed', { error: clipboard.lastError.value }),
      })
      return
    }

    const result = await swalModal.confirmTriple({
      title: t('scenarioStep.toolbar.pasteTitle'),
      text: t('scenarioStep.toolbar.pasteText'),
    })

    if (result.isConfirmed) {
      emit('update:modelValue', withFreshIds(parsed))
      swalToast.success({ title: t('scenarioStep.toolbar.pasteOverwrite') })
    } else if (result.isDenied) {
      emit('update:modelValue', { ...props.modelValue, ...withFreshIds(parsed) })
      swalToast.success({ title: t('scenarioStep.toolbar.pasteMerge') })
    }
  }
</script>
