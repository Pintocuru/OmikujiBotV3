<!-- src/console/users/components/UsersToolbar.vue -->
<!-- ツールバー: 接続の状態・自動更新・更新ボタン -->
<template>
  <div class="flex flex-wrap items-center justify-end gap-3 px-4 pt-3">
    <ConnectionBadge :status="status" :lastLoadedAt="lastLoadedAt" />
    <label class="label cursor-pointer gap-2 text-sm">
      <input v-model="autoRefresh" type="checkbox" class="toggle toggle-sm toggle-primary" />
      {{ usersMessages.toolbar.autoRefresh }}
    </label>
    <button class="btn btn-sm" @click="emit('refresh')">{{ usersMessages.toolbar.refresh }}</button>
  </div>
</template>

<script setup lang="ts">
  import type { ConsoleStatus } from '@/console/types'
  import { usersMessages } from '../maps/UsersMessageMap'
  import ConnectionBadge from './ConnectionBadge.vue'

  defineProps<{ status: ConsoleStatus; lastLoadedAt: number }>()
  const autoRefresh = defineModel<boolean>('autoRefresh', { required: true })
  const emit = defineEmits<{ refresh: [] }>()
</script>
