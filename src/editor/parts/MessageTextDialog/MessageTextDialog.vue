<!-- src/editor/parts/MessageTextDialog/MessageTextDialog.vue -->
<template>
  <!-- 1行インライン表示 -->
  <div class="flex gap-2 items-center w-full">
    <!-- singleLine モード:input(高さ 1 行固定) -->
    <input
      v-if="singleLine"
      type="text"
      v-model="displayValue"
      class="input input-bordered input-sm w-full"
      :placeholder="t('scenarioStep.messageDialog.inlinePlaceholder', { ph: '<<userName>>' })"
    />
    <!-- textarea -->
    <textarea
      v-else
      v-model="displayValue"
      rows="3"
      class="textarea textarea-bordered textarea-sm w-full"
      :placeholder="t('scenarioStep.messageDialog.inlinePlaceholder', { ph: '<<userName>>' })"
    />
    <button class="btn btn-sm btn-secondary gap-2" @click="openDialog">
      <PencilLine class="w-4 h-4" />
      <span class="hidden sm:inline">{{ t('scenarioStep.messageDialog.detailEdit') }}</span>
    </button>
  </div>

  <!-- メインダイアログ(高さはこのダイアログ専用に指定。モーダルの max-h-[90vh] に収まるよう calc) -->
  <BaseEditDialog
    ref="baseDialog"
    size="6xl"
    body-class="h-[calc(90vh-12rem)] min-h-80"
    always-show-right-sidebar
    :title="t('scenarioStep.messageDialog.dialogTitle')"
    icon="MessageSquare"
    @save="handleSave"
  >
    <!-- 中央: エディター + プレビュー -->
    <div class="flex flex-col h-full min-h-0">
      <div class="p-2 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between gap-2">
        <!-- タイトル -->
        <span class="text-xs font-semibold text-base-content">{{ t('scenarioStep.messageDialog.editTitle') }}</span>

        <!-- キーボード表示 -->
        <div class="hidden sm:flex gap-1 items-center">
          <kbd class="kbd kbd-xs">Ctrl</kbd>
          <kbd class="kbd kbd-xs">Enter</kbd>
          <span class="text-xs text-base-content/50 ml-1">{{ t('scenarioStep.messageDialog.saveWith') }}</span>
        </div>
      </div>

      <!-- エディター -->
      <div class="flex-1 min-h-0 p-2 flex flex-col gap-2">
        <textarea
          ref="textareaRef"
          v-model="draftText"
          autofocus
          class="textarea textarea-bordered flex-1 min-h-16 font-mono text-sm resize-none leading-relaxed w-full"
          :placeholder="t('scenarioStep.messageDialog.textareaPlaceholder', { userName: '<<userName>>', r: '<<r>>' })"
          @keydown.ctrl.enter="handleSave"
        />
        <div class="text-right text-xs text-base-content/40">
          {{ t('scenarioStep.messageDialog.charCount', { n: draftText.length }) }}
          <span v-if="lineCount > 1">{{ t('scenarioStep.messageDialog.lineCount', { n: lineCount }) }}</span>
        </div>
      </div>

      <!-- プレビュー -->
      <div class="border-base-300 px-3 bg-base-100">
        <MessagePreviewPanel :draft-text="draftText" />
      </div>
    </div>

    <!-- 右: PlaceholderPanel -->
    <template #sidebar-right>
      <PlaceholderPanel :draft-text="draftText" @insert="insertPlaceholder" @open-inline-ph="inlinePhDialog?.open()" />
    </template>

    <!-- フッター補足リンク(評価ブロック チートリスト) -->
    <template #footer-info>
      <a
        class="link no-underline hover:underline"
        href="https://github.com/Pintocuru/OmikujiBotV3/blob/main/docs/core/ConfigEditor/sub/VariablePlaceholderCheatSheet.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t('scenarioStep.messageDialog.cheatSheet') }}
      </a>
    </template>
  </BaseEditDialog>

  <!-- 簡易プレースホルダー入力ダイアログ -->
  <InlinePlaceholderDialog ref="inlinePhDialog" @insert="insertInlinePlaceholder" />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref, nextTick } from 'vue'
  import BaseEditDialog from '@/editor/parts/BaseEditDialog.vue'
  import PlaceholderPanel from './PlaceholderPanel.vue'
  import MessagePreviewPanel from './MessagePreviewPanel.vue'
  import InlinePlaceholderDialog from './InlinePlaceholderDialog.vue'
  import { PencilLine } from 'lucide-vue-next'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: string
    singleLine?: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const inlinePhDialog = ref<InstanceType<typeof InlinePlaceholderDialog> | null>(null)
  const draftText = ref('')

  const displayValue = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => emit('update:modelValue', value),
  })

  const openDialog = () => {
    draftText.value = props.modelValue
    baseDialog.value?.showModal()
  }

  const handleSave = () => {
    emit('update:modelValue', draftText.value)
    baseDialog.value?.close()
  }

  const lineCount = computed(() => draftText.value.split('\n').length)

  const insertAtCursor = (insertion: string) => {
    const ta = textareaRef.value
    if (!ta) {
      draftText.value += insertion
      return
    }
    const start = ta.selectionStart ?? draftText.value.length
    const end = ta.selectionEnd ?? draftText.value.length
    draftText.value = draftText.value.slice(0, start) + insertion + draftText.value.slice(end)
    nextTick(() => {
      ta.focus()
      ta.setSelectionRange(start + insertion.length, start + insertion.length)
    })
  }

  const insertPlaceholder = (key: string) => insertAtCursor(`<<${key}>>`)
  const insertInlinePlaceholder = (text: string) => insertAtCursor(text)
</script>
