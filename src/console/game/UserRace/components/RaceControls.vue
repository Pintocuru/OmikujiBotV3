<!-- src/console/game/UserRace/components/RaceControls.vue -->
<!-- 操作バー (OBS でウィンドウをキャプチャするときは、隠せる) -->
<template>
  <footer class="flex flex-wrap items-center gap-3 bg-base-300 px-4 py-2 text-base-content">
    <button type="button" class="btn btn-primary btn-sm" :disabled="busy" @click="emit('start')">
      {{
        phase === 'loading'
          ? userRaceMessages.controls.loading
          : phase === 'finished'
            ? userRaceMessages.controls.again
            : userRaceMessages.controls.start
      }}
    </button>
    <button type="button" class="btn btn-ghost btn-sm" :disabled="phase === 'idle'" @click="emit('reset')">
      {{ userRaceMessages.controls.reset }}
    </button>
    <span class="grow text-right text-xs opacity-60">{{ userRaceMessages.controls.hint }}</span>
    <button type="button" class="btn btn-ghost btn-sm" @click="emit('hide')">
      {{ userRaceMessages.controls.hide }}
    </button>
  </footer>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { RacePhase } from '../composables/useUserRace'
  import { userRaceMessages } from '../maps/UserRaceMessageMap'

  const props = defineProps<{ phase: RacePhase }>()
  const emit = defineEmits<{ start: []; reset: []; hide: [] }>()

  // 読み込み中・カウントダウン中・走行中は、スタートを押せない
  const busy = computed(() => props.phase === 'loading' || props.phase === 'countdown' || props.phase === 'running')
</script>
