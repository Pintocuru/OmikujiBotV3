<!-- src/console/users/components/ConnectionBadge.vue -->
<!-- 接続の状態 (接続中 / 未接続 / エラー / 読み込み中) と、最後に読み込んだ時刻 -->
<template>
  <span class="badge" :class="badge.class">{{ badge.text }}</span>
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
      case 'online':
        return { text: usersMessages.connection.online, class: 'badge-success' }
      case 'offline':
        return { text: usersMessages.connection.offline, class: 'badge-warning' }
      case 'error':
        return { text: usersMessages.connection.error, class: 'badge-error' }
      default:
        return { text: usersMessages.connection.loading, class: 'badge-ghost' }
    }
  })
</script>
