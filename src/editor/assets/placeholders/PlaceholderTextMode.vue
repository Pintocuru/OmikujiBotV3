<!-- src/editor/assets/placeholders/PlaceholderTextMode.vue -->
<template>
  <BaseEditDialog
    ref="baseDialog"
    :title="t('placeholder.textMode')"
    icon="FileText"
    :saveDisabled="hasErrors || validItemsCount === 0"
    @save="handleSave"
  >
    <div class="flex flex-col h-full p-3 gap-3">
      <!-- 入力形式の説明 -->
      <InformationCard>
        <p>{{ t('placeholder.inputFormat') }}</p>
        <p>
          • <code class="label bg-accent text-accent-content">{{ t('placeholder.lineFormat') }}</code>
        </p>
        <p>
          • {{ t('placeholder.formatLabel') }}:
          <code class="bg-accent px-1 rounded">{{ t('placeholder.formatExample1') }}</code>
        </p>
        <p>
          • {{ t('placeholder.example') }}:
          <code class="bg-accent px-1 rounded">3,{{ t('placeholder.sampleText') }}</code> {{ t('placeholder.or') }}
          <code class="bg-accent px-1 rounded">{{ t('placeholder.sampleText') }}</code
          >（{{ t('placeholder.defaultWeightNote') }}）
        </p>
        <p>• {{ t('placeholder.weightNote') }}</p>
      </InformationCard>

      <!-- テキストエリア -->
      <div class="form-control flex-1 flex flex-col min-h-0">
        <label class="label shrink-0">
          <span class="label-text font-medium">{{ t('placeholder.textInputLabel') }}</span>
          <span class="label-text-alt">{{ t('placeholder.lineCount', { count: lineCount }) }}</span>
        </label>
        <textarea
          ref="textareaRef"
          v-model="textContent"
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
  import { ref, computed, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { WeightValuesArrayType, WeightValueSchema } from '@/types/OmikujiData'
  import BaseEditDialog from '@/editor/parts/BaseEditDialog.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'

  const { t } = useI18n()

  const props = defineProps<{
    initialValues: WeightValuesArrayType
  }>()

  const emit = defineEmits<{
    save: [values: WeightValuesArrayType]
  }>()

  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const textContent = ref('')

  // 初期値をテキストに変換
  const initializeText = () => {
    textContent.value = props.initialValues
      .map((value) => {
        if (typeof value === 'string') {
          return value
        }
        return value.weight === 1 ? value.content : `${value.weight},${value.content}`
      })
      .join('\n')
  }

  // 行数計算
  const lineCount = computed(() => {
    return textContent.value.split('\n').length
  })

  // 行をパースしてバリデーション
  const parseAndValidateLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed) return null

    // 最初のカンマだけを分割対象にする
    const firstCommaIndex = trimmed.indexOf(',')
    let candidate

    if (firstCommaIndex > -1) {
      const weightStr = trimmed.slice(0, firstCommaIndex).trim()
      const contentStr = trimmed.slice(firstCommaIndex + 1).trim()
      const weight = parseInt(weightStr, 10)

      if (!isNaN(weight)) {
        candidate = { weight, content: contentStr }
      } else {
        candidate = { weight: 1, content: trimmed }
      }
    } else {
      candidate = { weight: 1, content: trimmed }
    }

    const result = WeightValueSchema.safeParse(candidate)

    return {
      ...candidate,
      hasError: !result.success,
    }
  }

  // プレビューアイテム
  const previewItems = computed(() => {
    return textContent.value
      .split('\n')
      .map(parseAndValidateLine)
      .filter((item) => item !== null)
  })

  // バリデーション状態
  const hasErrors = computed(() => previewItems.value.some((item) => item.hasError))
  const validItemsCount = computed(() => previewItems.value.filter((item) => !item.hasError).length)
  const errorCount = computed(() => previewItems.value.filter((item) => item.hasError).length)

  // テキストから値に変換
  const convertTextToValues = (): WeightValuesArrayType => {
    return previewItems.value
      .filter((item) => !item.hasError)
      .map(({ weight, content }) => {
        // 重みが1の場合は文字列として返す（スキーマの変換ロジックに合わせる）
        return weight === 1 ? content : { weight, content }
      })
  }

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
    nextTick(() => textareaRef.value?.focus())
  }

  defineExpose({ open })
</script>
