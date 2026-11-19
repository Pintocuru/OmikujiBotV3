<!-- src/console/control/UsersConsole/components/ConnectionBadge.vue -->
<!-- 読み込みの状態 (エラー / 読み込み中) と、最後に読み込んだ時刻。サーバーへの接続状態は、ヘッダーの ServerStatus が表示する -->
<template>
  <span v-if="badge" class="badge" :class="badge.class">{{ badge.text }}</span>
  <span v-if="lastLoadedAt" class="hidden text-xs opacity-60 sm:inline">
    {{ usersMessages.toolbar.updatedAt(formatTime(lastLoadedAt)) }}
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { ConsoleStatus } from '@/console/types'
  import { formatTime } from '@/console/common/scripts/formatters'
  import { usersMessages } from '../maps/UsersMessageMap'

  const props = defineProps<{ status: ConsoleStatus; lastLoadedAt: number }>()

  const badge = computed(() => {
    switch (props.status) {
      case 'error':
        return { text: usersMessages.connection.error, class: 'badge-error' }
      case 'loading':
        return { text: usersMessages.connection.loading, class: 'badge-ghost' }
      default:
        return undefined
    }
  })
</script>
