<!-- src/console/log/GameLog/components/GameLogToolbar.vue -->
<!-- ゲームの記録画面の上部: 更新状況・自動更新・更新ボタン・開発用のテスト記録追加 -->
<template>
  <div class="flex flex-wrap items-center justify-end gap-3 px-4 pt-3">
    <span v-if="status === 'error'" class="badge badge-error">エラー</span>
    <span v-if="lastLoadedAt" class="hidden text-xs opacity-60 sm:inline">更新 {{ formatTime(lastLoadedAt) }}</span>
    <label class="label cursor-pointer gap-2 text-sm">
      <input
        :checked="autoRefresh"
        type="checkbox"
        class="toggle toggle-sm toggle-primary"
        @change="emit('update:autoRefresh', ($event.target as HTMLInputElement).checked)"
      />
      自動更新
    </label>
    <button class="btn btn-sm btn-neutral" @click="emit('refresh')">更新</button>
    <!-- 開発サーバー専用: 本番では GameRanking が記録を追記するが、開発サーバーには追記する側がいない -->
    <button
      v-if="isDev"
      class="btn btn-sm btn-outline btn-accent"
      :disabled="adding"
      title="開発用: テスト用のゲームの記録を追加します(本番では表示されません)"
      @click="emit('addMock')"
    >
      🧪 テスト用の記録を追加
    </button>
  </div>

  <div v-if="mockError" class="alert alert-error mx-4 mt-3 py-2 text-sm">
    <span class="break-all">テスト用の記録を追加できませんでした: {{ mockError }}</span>
  </div>
</template>

<script setup lang="ts">
  import { isDev } from '@/common/AppEnv'
  import { formatTime } from '@/console/common/scripts/formatters'
  import type { ConsoleStatus } from '@/console/types'

  defineProps<{
    status: ConsoleStatus
    lastLoadedAt: number
    autoRefresh: boolean
    adding: boolean
    mockError: string
  }>()

  const emit = defineEmits<{
    'update:autoRefresh': [value: boolean]
    refresh: []
    addMock: []
  }>()
</script>
