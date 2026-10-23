<!-- src/console/components/StreamList.vue -->
<template>
  <ul class="menu bg-base-200 rounded-box w-full gap-1">
    <li class="menu-title">配信 ({{ streams.length }})</li>
    <li v-if="streams.length === 0" class="px-4 py-2 text-sm opacity-60">保存された配信はまだありません</li>
    <li v-for="stream in streams" :key="stream.streamId">
      <div
        class="flex items-center justify-between gap-2"
        :class="{ 'menu-active': stream.streamId === selectedStreamId }"
        @click="emit('select', stream.streamId)"
      >
        <span class="flex flex-col items-start">
          <span class="font-medium">{{ formatStreamId(stream.streamId) }}</span>
          <span class="text-xs opacity-60">更新 {{ formatDateTime(stream.updatedAt) }}</span>
        </span>
        <button
          class="btn btn-ghost btn-xs btn-square"
          title="この配信のログを削除"
          @click.stop="confirmRemove(stream.streamId)"
        >
          ✕
        </button>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { GameStateListItemType } from '@/types/api'
  import { formatDateTime, formatStreamId } from '../scripts/summarizeState'

  defineProps<{
    streams: GameStateListItemType[]
    selectedStreamId: string | null
  }>()

  const emit = defineEmits<{
    select: [streamId: string]
    remove: [streamId: string]
  }>()

  const confirmRemove = (streamId: string) => {
    if (window.confirm(`${formatStreamId(streamId)} の配信ログを削除します。元に戻せません。よろしいですか?`)) {
      emit('remove', streamId)
    }
  }
</script>
