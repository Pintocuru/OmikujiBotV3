<!-- src/console/LiveConsole.vue -->
<template>
  <div class="min-h-screen bg-base-100 text-base-content" data-theme="dark">
    <header class="navbar sticky top-0 z-10 gap-4 bg-base-200 shadow">
      <h1 class="text-lg font-bold">LiveConsole</h1>

      <!-- 画面の切り替え -->
      <div role="tablist" class="tabs tabs-box tabs-sm">
        <button
          v-for="(name, key) in views"
          :key="key"
          role="tab"
          class="tab"
          :class="{ 'tab-active': view === key }"
          @click="view = key"
        >
          {{ name }}
        </button>
      </div>
    </header>

    <UsersView v-if="view === 'users'" />
    <PadsView v-else-if="view === 'pads'" />
    <GameLogsView v-else />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import GameLogsView from './components/GameLogsView.vue'
  import UsersView from './components/UsersView.vue'
  import PadsView from './components/PadsView.vue'

  const views = { pads: 'ポン出し', users: 'ユーザー操作', games: 'ゲームの記録' } as const
  type ViewKey = keyof typeof views

  // 再読み込みしても、同じ画面に戻れるよう URL の # に覚えておく (例: console.html#games)
  const fromHash = (): ViewKey => {
    const key = location.hash.slice(1)
    return key in views ? (key as ViewKey) : 'pads'
  }
  const view = ref<ViewKey>(fromHash())
  watch(view, (key) => history.replaceState(null, '', `#${key}`))
</script>
