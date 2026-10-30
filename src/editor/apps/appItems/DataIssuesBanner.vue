<!-- src/editor/apps/appItems/DataIssuesBanner.vue -->
<template>
  <div v-if="loadIssues.length > 0 && !dismissed" role="alert" class="alert alert-warning alert-vertical sm:alert-horizontal items-start">
    <TriangleAlert class="w-5 h-5 shrink-0" />
    <div class="flex-1 min-w-0 space-y-1">
      <div class="font-bold">{{ summary }}</div>
      <div class="text-sm">不正なデータは読み込まずに飛ばしました。このまま保存すると、除外したデータは保存先から消えます。</div>

      <details class="text-sm">
        <summary class="cursor-pointer select-none">詳細を表示</summary>
        <ul class="mt-2 space-y-2 max-h-80 overflow-y-auto">
          <li v-for="(issue, i) in loadIssues" :key="i" class="bg-base-100/60 rounded p-2">
            <div class="font-mono text-xs break-all">
              {{ issue.category }} &gt; {{ locationOf(issue) }}
              <span class="badge badge-xs ml-1" :class="issue.action === 'dropped' ? 'badge-error' : 'badge-info'">
                {{ issue.action === 'dropped' ? '除外' : '既定値に戻した' }}
              </span>
            </div>
            <div class="text-xs mt-1">{{ issue.reason }}</div>
            <pre class="text-xs mt-1 p-1 bg-base-200 rounded overflow-x-auto max-h-24">{{ previewRaw(issue.raw) }}</pre>
          </li>
        </ul>
      </details>
    </div>
    <button class="btn btn-sm btn-ghost" @click="dismissed = true">閉じる</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { TriangleAlert } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { formatParseIssuesSummary, ParseIssue } from '@/types/core/ParseIssues'

  const { loadIssues } = storeToRefs(useOmikujiStore())
  const summary = computed(() => formatParseIssuesSummary(loadIssues.value))

  // 閉じても、保存時の確認は出る。読み込み直したら再表示する
  const dismissed = ref(false)
  watch(loadIssues, () => (dismissed.value = false))

  const locationOf = (issue: ParseIssue) => [...issue.path, issue.key].filter((k) => k !== '').join(' > ') || '(全体)'

  const previewRaw = (raw: unknown): string => {
    try {
      const text = JSON.stringify(raw, null, 2) ?? String(raw)
      return text.length > 600 ? `${text.slice(0, 600)}…` : text
    } catch {
      return String(raw)
    }
  }
</script>
