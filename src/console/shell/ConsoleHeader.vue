<!-- src/console/shell/ConsoleHeader.vue -->
<template>
  <header class="flex items-center justify-between p-2 bg-primary text-primary-content shadow-md z-40">
    <div class="flex items-center gap-4 min-w-0">
      <!-- タイトル -->
      <h1 class="font-extrabold text-lg whitespace-nowrap">おみくじBOT コンソール</h1>

      <!-- 各種コンテンツ -->
      <nav role="tablist" aria-label="コンソール画面" class="flex items-center gap-1 min-w-0">
        <button
          v-for="key in visibleKeys"
          :key="key"
          type="button"
          role="tab"
          :aria-selected="key === current"
          class="px-2 py-1 text-sm border-b-2 transition-colors whitespace-nowrap"
          :class="
            key === current ? 'border-primary-content font-semibold' : 'border-transparent opacity-80 hover:opacity-100'
          "
          @click="emit('select', key)"
        >
          {{ getConsoleViewMeta(key).label }}
          <span v-if="getConsoleViewMeta(key).launch === 'window'" aria-hidden="true">↗</span>
        </button>
      </nav>
    </div>

    <!-- 右側 -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- サーバーとの接続状態 -->
      <ServerStatus />

      <!-- テーマ切り替えボタン -->
      <div class="tooltip tooltip-left" :data-tip="themeTitle">
        <button type="button" class="btn btn-sm btn-square" :aria-label="themeTitle" @click="toggleTheme">
          <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Moon, Sun } from '@lucide/vue'
  import { useConsoleTheme } from '../composables/useConsoleTheme'
  import { useServerConnection } from '../composables/useServerConnection'
  import { getConsoleViewMeta, type ConsoleViewKey } from '../maps/ConsoleViewMap'
  import ServerStatus from './ServerStatus.vue'

  const props = defineProps<{
    keys: ConsoleViewKey[]
    current: ConsoleViewKey | undefined
  }>()

  const emit = defineEmits<{
    select: [key: ConsoleViewKey]
  }>()

  const { isDark, themeTitle, toggleTheme } = useConsoleTheme()
  const { connected } = useServerConnection()

  // 別ウィンドウで開く画面は、サーバーに接続できているときだけ表示する
  const visibleKeys = computed(() =>
    props.keys.filter((key) => getConsoleViewMeta(key).launch !== 'window' || connected.value)
  )
</script>
