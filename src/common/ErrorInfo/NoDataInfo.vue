<!-- src/common/ErrorInfo/NoDataInfo.vue -->
<template>
  <div class="w-full flex flex-col items-center justify-center p-2">
    <div class="card bg-base-100 border border-warning w-full max-w-2xl shadow-lg">
      <div class="card-body gap-4 p-4 sm:p-6">
        <h2 class="flex items-center justify-center gap-2 text-warning text-lg sm:text-xl font-bold">
          <FileQuestion class="w-6 h-6 shrink-0" />
          おみくじデータがありません
          <span class="text-sm font-normal">/ No Data</span>
        </h2>

        <div role="alert" class="alert alert-warning">
          <div>
            <p class="text-sm">omikujiData.js もサーバーのデータも読み込めませんでした。</p>
            <p class="text-xs">Neither omikujiData.js nor server data could be loaded.</p>
          </div>
        </div>

        <section class="rounded-lg border border-base-300 bg-base-200 p-4 text-sm space-y-3">
          <div class="flex items-start gap-3">
            <span class="badge badge-neutral badge-sm shrink-0 mt-0.5">1</span>
            <div>
              <p>index.html と同じフォルダに omikujiData.js があるか確認してください</p>
              <p class="text-xs">Make sure omikujiData.js is in the same folder as index.html.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="badge badge-neutral badge-sm shrink-0 mt-0.5">2</span>
            <div>
              <p>エディターで書き出した omikujiData.js を使っているか確認してください</p>
              <p class="text-xs">Use the omikujiData.js exported from the editor.</p>
            </div>
          </div>
        </section>

        <div v-if="errorDetail" class="text-sm">
          <p class="font-bold text-warning">エラー詳細 / Error Details</p>
          <pre class="mt-1 whitespace-pre-wrap break-all text-xs">{{ errorDetail }}</pre>
        </div>

        <div class="flex justify-center">
          <button type="button" class="btn btn-primary" @click="handleReload">
            <RotateCcw class="w-5 h-5" />
            再読み込み
            <span class="text-sm font-normal">/ Reload</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FileQuestion, RotateCcw } from 'lucide-vue-next'

  defineProps<{ errorDetail?: string }>()

  const handleReload = () => window.location.reload()
</script>
