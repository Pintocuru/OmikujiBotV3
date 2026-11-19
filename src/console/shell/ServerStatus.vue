<!-- src/console/shell/ServerStatus.vue -->
<!-- サーバー(わんコメのプラグイン / 開発用 Express)との接続状態。開発時(isDev)は、ボタンでサーバーを切り替えられる -->
<template>
  <div class="flex items-center gap-2 text-xs whitespace-nowrap" role="status" aria-live="polite">
    <span class="flex items-center gap-1.5">
      <span
        class="inline-block w-2 h-2 rounded-full ring-1 ring-primary-content/60"
        :class="dotClass"
        aria-hidden="true"
      />
      {{ statusLabel }}
    </span>

    <!-- 開発時のみ: サーバーの切り替え -->
    <div v-if="canSwitch" class="tooltip tooltip-bottom" :data-tip="switchTitle">
      <button type="button" class="btn btn-sm" :disabled="switching" :aria-label="switchTitle" @click="toggleMode">
        <ArrowLeftRight class="w-4 h-4" />
        {{ modeName }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ArrowLeftRight } from '@lucide/vue'
  import { useServerConnection } from '../composables/useServerConnection'

  const { state, canSwitch, switching, modeName, nextModeName, toggleMode } = useServerConnection()

  const statusLabel = computed(() => ({ online: '接続中', offline: '未接続', checking: '確認中' })[state.value])
  const dotClass = computed(() => ({ online: 'bg-success', offline: 'bg-error', checking: 'bg-warning animate-pulse' })[state.value])
  const switchTitle = computed(() => `${nextModeName.value}に切り替え`)
</script>
