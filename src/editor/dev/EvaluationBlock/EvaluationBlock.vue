<!-- src/editor/dev/EvaluationBlock/EvaluationBlock.vue -->
<template>
  <div class="card bg-base-200/90 backdrop-blur border border-base-300 shadow-xl w-full">
    <div class="card-body gap-2 p-2">
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b border-base-300 cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <h1 class="text-sm flex items-center gap-2">
          評価ブロック
          <span class="badge badge-xs badge-neutral">{{ entries.length }}</span>
          <span v-if="paused" class="badge badge-xs badge-warning">一時停止中</span>
        </h1>
        <span class="text-xs opacity-60">{{ collapsed ? '▶' : '▼' }}</span>
      </div>

      <template v-if="!collapsed">
        <!-- 検索 / 一時停止 -->
        <div class="join w-full">
          <input
            v-model="query"
            type="search"
            placeholder="検索 (anygame_* で集計)"
            class="input input-bordered input-xs join-item flex-1"
          />
          <button
            class="btn btn-xs join-item"
            :class="paused ? 'btn-warning' : 'btn-outline'"
            title="表示の更新を止めて、値をじっくり確認する"
            @click="paused = !paused"
          >
            {{ paused ? '再開' : '停止' }}
          </button>
        </div>

        <!-- ワイルドカード検索の集計 -->
        <div v-if="summary" class="rounded border border-base-300 p-2 space-y-1 text-xs">
          <div class="font-semibold">{{ query.trim() }} : {{ summary.matched }}件</div>

          <template v-if="summary.numbers">
            <div class="flex flex-wrap gap-1">
              <span class="badge badge-sm badge-primary">平均 {{ summary.numbers.avg }}</span>
              <span class="badge badge-sm badge-ghost">合計 {{ summary.numbers.sum }}</span>
              <span class="badge badge-sm badge-ghost">最大 {{ summary.numbers.max }}</span>
              <span class="badge badge-sm badge-ghost">最小 {{ summary.numbers.min }}</span>
            </div>
            <ol class="max-h-28 overflow-y-auto space-y-0.5">
              <li v-for="(row, i) in summary.numbers.ranking" :key="row.key" class="flex gap-2">
                <span class="w-5 text-right opacity-60">{{ i + 1 }}</span>
                <span class="font-mono flex-1 truncate" :title="row.key">{{ row.label }}</span>
                <span class="font-mono tabular-nums">{{ row.value }}</span>
              </li>
            </ol>
          </template>

          <template v-if="summary.strings">
            <div class="opacity-60">文字列の出現数</div>
            <ol class="max-h-28 overflow-y-auto space-y-0.5">
              <li v-for="(row, i) in summary.strings.ranking" :key="row.value" class="flex gap-2">
                <span class="w-5 text-right opacity-60">{{ i + 1 }}</span>
                <span class="flex-1 truncate">{{ row.value }}</span>
                <span class="font-mono tabular-nums">×{{ row.count }}</span>
              </li>
            </ol>
          </template>
        </div>

        <!-- 変数一覧 -->
        <div class="max-h-64 overflow-y-auto rounded border border-base-300">
          <table class="table table-xs table-zebra table-pin-rows">
            <thead>
              <tr>
                <th>変数</th>
                <th class="text-right">値</th>
                <th class="w-12"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="[key, value] in filteredEntries"
                :key="key"
                class="transition-colors duration-500"
                :class="flashKeys.has(key) ? 'bg-warning/40' : ''"
              >
                <td class="font-mono text-primary break-all">{{ key }}</td>
                <td class="text-right">
                  <span class="font-mono tabular-nums break-all">{{ value }}</span>
                  <span class="badge badge-xs badge-ghost ml-1">{{ typeof value === 'number' ? '数値' : '文字' }}</span>
                </td>
                <td class="whitespace-nowrap">
                  <button
                    class="btn btn-ghost btn-xs px-1 opacity-60"
                    title="下の入力欄に読み込んで編集"
                    @click="edit(key, value)"
                  >
                    ✎
                  </button>
                  <button class="btn btn-ghost btn-xs px-1 opacity-60" title="この変数を削除" @click="removeKey(key)">
                    ×
                  </button>
                </td>
              </tr>
              <tr v-if="filteredEntries.length === 0">
                <td colspan="3" class="text-center opacity-60 py-3">
                  {{ entries.length === 0 ? '変数はまだありません' : '一致する変数がありません' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 変数の追加・編集 -->
        <div class="space-y-1">
          <div class="join w-full">
            <input
              v-model="formKey"
              type="text"
              placeholder="変数名 例: anygame_user1"
              class="input input-bordered input-xs join-item flex-1 font-mono"
              @keydown.enter="submitForm"
            />
            <input
              v-model="formValue"
              type="text"
              placeholder="値 例: 1000 / 'すいか'"
              class="input input-bordered input-xs join-item w-28"
              @keydown.enter="submitForm"
            />
            <button class="btn btn-xs btn-primary join-item" @click="submitForm">設定</button>
          </div>
          <p v-if="formError" class="text-xs text-error">{{ formError }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import {
    hasWildcard,
    parseVariableValue,
    summarizeByPattern,
    VARIABLE_NAME_PATTERN,
    VarEntry,
    VarValue,
    wildcardToRegExp,
  } from './evaluationStats'

  // PlaceholderVariable はリアクティブではないため、一定間隔で読み直す
  const POLL_MS = 500
  const FLASH_MS = 1200

  const appStore = useAppStore()

  const collapsed = ref(false)
  const paused = ref(false)
  const query = ref('')
  const entries = shallowRef<VarEntry[]>([])
  const flashKeys = shallowRef<Set<string>>(new Set())

  // 追加・編集フォーム
  const formKey = ref('')
  const formValue = ref('')
  const formError = ref('')

  let prev = new Map<string, VarValue>()
  let pollTimer: ReturnType<typeof setInterval> | null = null
  const flashTimers = new Set<ReturnType<typeof setTimeout>>()

  // * を含む検索は、変数名へのワイルドカード検索(集計つき)
  const isWildcardQuery = computed(() => hasWildcard(query.value))

  const filteredEntries = computed(() => {
    const q = query.value.trim()
    if (!q) return entries.value
    if (isWildcardQuery.value) {
      const regex = wildcardToRegExp(q)
      return entries.value.filter(([key]) => regex.test(key))
    }
    const lower = q.toLowerCase()
    return entries.value.filter(
      ([key, value]) => key.toLowerCase().includes(lower) || String(value).toLowerCase().includes(lower)
    )
  })

  const summary = computed(() => {
    if (!isWildcardQuery.value) return null
    const result = summarizeByPattern(entries.value, query.value)
    return result.matched > 0 ? result : null
  })

  function refresh() {
    const next = Object.entries(appStore.placeholderVariable.getAll()).sort(([a], [b]) => a.localeCompare(b))

    // 前回から増えた・変わった変数を一定時間ハイライト
    const changed = next.filter(([key, value]) => prev.get(key) !== value).map(([key]) => key)
    if (prev.size > 0 && changed.length > 0) highlight(changed)

    prev = new Map(next)
    entries.value = next
  }

  function highlight(keys: string[]) {
    flashKeys.value = new Set([...flashKeys.value, ...keys])
    const timer = setTimeout(() => {
      flashTimers.delete(timer)
      const rest = new Set(flashKeys.value)
      keys.forEach((key) => rest.delete(key))
      flashKeys.value = rest
    }, FLASH_MS)
    flashTimers.add(timer)
  }

  function removeKey(key: string) {
    appStore.placeholderVariable.remove(key)
    refresh()
  }

  function edit(key: string, value: VarValue) {
    formKey.value = key
    // 文字列は 'すいか' のように引用符つきで戻すと、数字だけの文字列も文字列のまま設定できる
    formValue.value = typeof value === 'string' ? `'${value}'` : String(value)
    formError.value = ''
  }

  function submitForm() {
    const key = formKey.value.trim()
    if (!VARIABLE_NAME_PATTERN.test(key)) {
      formError.value = '変数名は英数字と _ だけで、数字から始めることはできません'
      return
    }
    if (formValue.value.trim() === '') {
      formError.value = '値を入力してください'
      return
    }
    // 引用符つきは常に文字列、それ以外は数値として読めれば数値
    const value = parseVariableValue(formValue.value)

    appStore.placeholderVariable.getEvaluator().set(key, value)
    formError.value = ''
    refresh()
  }

  onMounted(() => {
    refresh()
    pollTimer = setInterval(() => {
      if (!paused.value) refresh()
    }, POLL_MS)
  })

  onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer)
    flashTimers.forEach(clearTimeout)
  })
</script>
