<!-- src/ui/user/LuckyDraw/parts/HistoryButton.vue -->
<template>
  <div class="absolute top-0 right-0 z-50" @mouseenter="isHovered = true" @mouseleave="isHovered = false" @click.stop>
    <!-- 履歴ボタン -->
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
      :class="isHovered || showHistory ? 'opacity-100' : 'opacity-0'"
      :style="{ background: color.accent, color: color.background }"
      @click="showHistory = !showHistory"
    >
      <Clock class="h-5 w-5" />
    </button>

    <!-- 履歴パネル -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="showHistory" class="absolute right-0 top-10 max-h-48 w-80 overflow-y-auto">
        <div
          class="rounded-xl border-2 p-3 shadow-xl backdrop-blur-md"
          :style="{ background: color.background, borderColor: color.accent, color: color.text }"
        >
          <h3 class="mb-2 flex items-center gap-2 text-sm font-bold">
            <History class="h-4 w-4" />
            {{ $t('uiSettings.luckyDraw.history.title') }}
          </h3>

          <div v-if="historyItems.length === 0" class="py-4 text-center text-sm opacity-60">
            {{ $t('uiSettings.luckyDraw.history.empty') }}
          </div>

          <div v-else class="space-y-2">
            <div v-for="(item, index) in historyItems" :key="item.id" class="rounded-lg bg-black/10 p-2 text-xs">
              <div class="mb-1 flex justify-between opacity-70">
                <span class="flex items-center gap-1">
                  <Hash class="h-3 w-3" />
                  {{ historyItems.length - index }}
                </span>
                <span>{{ formatTime(item.timestamp) }}</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(user, idx) in item.users"
                  :key="idx"
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                  :style="{ background: color.accent, color: color.background }"
                >
                  <User class="h-3 w-3" />
                  {{ user.userName }}
                </span>
              </div>
            </div>
          </div>

          <button
            v-if="historyItems.length > 0"
            type="button"
            class="mt-2 flex items-center gap-2 rounded-lg px-2 py-1 text-xs opacity-70 hover:opacity-100"
            @click="clear"
          >
            <Trash2 class="h-4 w-4" />
            {{ $t('uiSettings.luckyDraw.history.clear') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Clock, History, Hash, User, Trash2 } from 'lucide-vue-next'
  import type { CharacterColorType } from '@/types/OmikujiData'
  import type { LuckyDrawHistoryItem } from '../types'

  defineProps<{
    historyItems: LuckyDrawHistoryItem[]
    color: CharacterColorType
  }>()

  const emit = defineEmits<{ clear: [] }>()

  const isHovered = ref(false)
  const showHistory = ref(false)

  const clear = () => {
    emit('clear')
    showHistory.value = false
  }

  // 「何分前」「M/D HH:MM」の形にする(日本語・英語どちらでも読める表記)
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const diffSec = Math.floor((Date.now() - timestamp) / 1000)
    if (diffSec < 60) return `${Math.max(diffSec, 0)}s`
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${date.getMonth() + 1}/${date.getDate()} ${hh}:${mm}`
  }
</script>
