<!-- src/editor/assets/placeholders/PlaceholderTextMode.vue -->
<template>
  <!-- テキストモード(ダイアログ)を開くボタン -->
  <button @click="open" class="btn btn-sm btn-secondary">
    <Text class="w-4 h-4" />
    {{ t('placeholder.textMode') }}
  </button>

  <BaseEditDialog
    ref="baseDialog"
    :title="t('placeholder.textMode')"
    icon="FileText"
    bodyClass="h-[50vh]"
    :saveDisabled="hasErrors || validItemsCount === 0"
    @save="handleSave"
  >
    <div class="flex flex-col h-full p-3 gap-3">
      <!-- テキストエリア -->
      <div class="form-control flex-1 flex flex-col min-h-0">
        <div class="label shrink-0">
          <span class="label-text font-medium">{{ t('placeholder.textInputLabel') }}</span>
          <div class="flex items-center gap-2">
            <span class="label-text-alt">
              {{ t(lineCount === 1 ? 'placeholder.lineCountSingular' : 'placeholder.lineCount', { count: lineCount }) }}
            </span>

            <!-- ヘルプボタン -->
            <HelpButton :title="t('placeholder.inputFormat')">
              <p>{{ t('placeholder.lineFormat') }}</p>
              <p>
                {{ t('placeholder.formatLabel') }}:
                {{ t('placeholder.formatExample1') }}
              </p>
              <p>
                {{ t('placeholder.example') }}: 3,{{ t('placeholder.sampleText') }}
                {{ t('placeholder.or') }}
                {{ t('placeholder.sampleText') }}
                （{{ t('placeholder.defaultWeightNote') }}）
              </p>
              <p>{{ t('placeholder.weightNote') }}</p>
            </HelpButton>
          </div>
        </div>
        <textarea
          v-model="textContent"
          autofocus
          class="textarea textarea-bordered flex-1 min-h-40 font-mono text-sm resize-none w-full"
          :placeholder="t('placeholder.textareaPlaceholder')"
          @keydown.ctrl.enter="handleCtrlEnter"
        />
      </div>

      <!-- エラーサマリー -->
      <div v-if="hasErrors" class="alert alert-error shrink-0">
        <span class="text-lg">⚠️</span>
        <div>
          <div class="font-semibold">{{ t('placeholder.hasErrorTitle') }}</div>
          <div class="text-sm">{{ t('placeholder.hasErrorBody', { count: errorCount }) }}</div>
        </div>
      </div>
    </div>
  </BaseEditDialog>
</template>

<script setup lang="ts">
  import { ref, toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Text } from 'lucide-vue-next'

  import type { WeightValuesArrayType } from '@/types/OmikujiData'
  import BaseEditDialog from '@/editor/parts/BaseEditDialog.vue'
  import HelpButton from '@/editor/parts/HelpButton.vue'
  import { usePlaceholderTextMode } from './composables/usePlaceholderTextMode'

  const { t } = useI18n()

  const props = defineProps<{
    initialValues: WeightValuesArrayType
  }>()

  const emit = defineEmits<{
    save: [values: WeightValuesArrayType]
  }>()

  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)
  const { textContent, lineCount, hasErrors, validItemsCount, errorCount, initializeText, convertTextToValues } =
    usePlaceholderTextMode(toRef(props, 'initialValues'))

  // BaseEditDialog の保存ボタン(閉じる処理は BaseEditDialog 側)
  const handleSave = () => {
    if (hasErrors.value || validItemsCount.value === 0) return
    emit('save', convertTextToValues())
  }

  // Ctrl+Enter 保存(閉じる処理はこちらで行う)
  const handleCtrlEnter = () => {
    if (hasErrors.value || validItemsCount.value === 0) return
    handleSave()
    baseDialog.value?.close()
  }

  // 開くたびに最新の値でテキストを作り直す(キャンセル時の入力は破棄)
  const open = () => {
    initializeText()
    baseDialog.value?.showModal()
  }
</script>
