<!-- src/editor/shell/IssuesBadge.vue -->
<!-- 読み込み時に除外・既定値に戻した要素があるときのバッジ。クリックで内容を表示する -->
<template>
  <template v-if="loadIssues.length > 0">
    <button
      class="badge badge-warning text-warning-content gap-1 cursor-pointer"
      :title="summary"
      @click="dialogRef?.showModal()"
    >
      <TriangleAlert class="w-3 h-3" />
      {{ loadIssues.length }}
    </button>

    <dialog ref="dialogRef" class="modal">
      <div class="modal-box max-w-3xl text-base-content">
        <h3 class="font-bold text-lg flex items-center gap-2">
          <TriangleAlert class="w-5 h-5 text-warning" />
          {{ summary }}
        </h3>
        <p class="text-sm py-2">{{ t('shell.issues.explanation') }}</p>

        <ul class="space-y-2 max-h-96 overflow-y-auto">
          <li v-for="(issue, i) in loadIssues" :key="i" class="bg-base-200 rounded p-2">
            <div class="font-mono text-xs break-all">
              {{ issue.category }} &gt; {{ locationOf(issue) }}
              <span class="badge badge-xs ml-1" :class="issue.action === 'dropped' ? 'badge-error' : 'badge-info'">
                {{ issue.action === 'dropped' ? t('shell.issues.dropAction') : t('shell.issues.defaultAction') }}
              </span>
            </div>
            <div class="text-xs mt-1">{{ issue.reason }}</div>
            <pre class="text-xs mt-1 p-1 bg-base-100 rounded overflow-x-auto max-h-24">{{ previewRaw(issue.raw) }}</pre>
          </li>
        </ul>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">{{ t('shell.issues.close') }}</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button :aria-label="t('shell.issues.close')">{{ t('shell.issues.close') }}</button>
      </form>
    </dialog>
  </template>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { TriangleAlert } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { ParseIssue, summarizeParseIssues } from '@/types/core/ParseIssues'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { loadIssues } = storeToRefs(useOmikujiStore())
  const summary = computed(() => {
    const formatAction = (action: ParseIssue['action'], key: string) => {
      const { total, byCategory } = summarizeParseIssues(loadIssues.value.filter((issue) => issue.action === action))
      if (total === 0) return ''
      const breakdown = Object.entries(byCategory)
        .map(([category, count]) => t('shell.issues.categoryCount', { category, count }))
        .join(' / ')
      return t(key, { count: total, breakdown })
    }

    return [formatAction('dropped', 'shell.issues.dropped'), formatAction('defaulted', 'shell.issues.defaulted')]
      .filter(Boolean)
      .join(' / ')
  })
  const dialogRef = ref<HTMLDialogElement | null>(null)

  const locationOf = (issue: ParseIssue) =>
    [...issue.path, issue.key].filter((k) => k !== '').join(' > ') || t('shell.issues.whole')

  const previewRaw = (raw: unknown): string => {
    try {
      const text = JSON.stringify(raw, null, 2) ?? String(raw)
      return text.length > 600 ? `${text.slice(0, 600)}…` : text
    } catch {
      return String(raw)
    }
  }
</script>
