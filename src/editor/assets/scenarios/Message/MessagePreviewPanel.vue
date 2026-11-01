<!-- src/editor/assets/scenarios/Message/MessagePreviewPanel.vue -->
<template>
  <div class="flex flex-col gap-2 p-1">
    <div class="w-full">
      <!-- プレースホルダー展開例 -->
      <div class="divider text-xs my-1">{{ t('scenarioStep.preview.title') }}</div>

      <!-- エラー要約: 1 行 + 未解決の式(最大 3 件)だけを出す -->
      <div
        v-if="hasError"
        role="alert"
        class="mb-1 flex flex-wrap items-center gap-1 rounded-lg border border-error/30 bg-error/10 px-2 py-1 text-xs text-error"
      >
        <span>{{ t('scenarioStep.preview.hasError') }}</span>
        <span
          v-for="tok in unresolvedShown"
          :key="tok"
          class="badge badge-error badge-outline badge-sm max-w-40 truncate font-mono"
        >
          {{ tok }}
        </span>
        <span v-if="unresolvedRest > 0">{{ t('scenarioStep.preview.unresolvedMore', { n: unresolvedRest }) }}</span>
      </div>

      <div v-if="expandedPreviewDisplay.length">
        <!-- 展開結果: 高さを制限し、はみ出しは枠内スクロール。エラー時は既定で短く折りたたむ -->
        <div
          class="overflow-y-auto rounded-lg px-3 py-2 text-xs font-mono whitespace-pre-wrap wrap-break-word cursor-pointer transition-colors select-none"
          :class="[
            hasError
              ? 'bg-error/10 text-error border border-error/30'
              : 'bg-base-200 text-base-content/70 hover:bg-base-300',
            expanded ? 'max-h-64' : hasError ? 'max-h-16' : 'max-h-40',
          ]"
          :title="t('scenarioStep.preview.clickRefresh')"
          v-html="expandedPreviewDisplay"
          @click="refresh"
        />
        <button v-if="canToggle" class="btn btn-xs btn-ghost mt-1 gap-1" @click="expanded = !expanded">
          <component :is="expanded ? ChevronUp : ChevronDown" :size="12" />
          {{ expanded ? t('scenarioStep.preview.collapse') : t('scenarioStep.preview.showAll') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref } from 'vue'
  import { ChevronDown, ChevronUp } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { processTestPlaceholder } from '../preview/TestPlaceholderProcessor'

  const { t } = useI18n()

  const props = defineProps<{
    draftText: string
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = omikujiStore

  // 展開例の再抽選トリガー用カウンター
  const refreshCount = ref(0)
  // エラー時の展開結果を全文表示するか
  const expanded = ref(false)

  // 外部から呼び出せるように expose
  defineExpose({
    refresh,
  })

  function refresh() {
    refreshCount.value++
  }

  function escapeHtml(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  // 展開例（refreshCount を依存に含めることで再計算される）
  const expandedResult = computed(() => {
    void refreshCount.value
    try {
      return processTestPlaceholder(props.draftText, data.assets.placeholders ?? {})
    } catch {
      return {
        text: props.draftText,
        hasError: true,
      }
    }
  })

  const expandedPreviewDisplay = computed(() => {
    return escapeHtml(expandedResult.value.text)
  })

  const hasError = computed(() => expandedResult.value.hasError)

  // 評価できず残った {{ ... }} を重複なしで抽出(長いものは切り詰め)
  const unresolvedTokens = computed(() => {
    if (!hasError.value) return []
    const found = expandedResult.value.text.match(/\{\{[\s\S]*?\}\}/g) ?? []
    const normalized = found.map((s) => s.replace(/\s+/g, ' '))
    return [...new Set(normalized)].map((s) => (s.length > 40 ? s.slice(0, 40) + '…' : s))
  })
  const unresolvedShown = computed(() => unresolvedTokens.value.slice(0, 3))
  const unresolvedRest = computed(() => Math.max(0, unresolvedTokens.value.length - 3))

  // 折りたたみトグルはエラー時の長文だけに出す
  const canToggle = computed(
    () => hasError.value && (expandedResult.value.text.length > 80 || expandedResult.value.text.includes('\n'))
  )
</script>
