<!-- src/console/game/NuisanceSurvival/components/NuisanceTopBar.vue -->
<!-- 上部バー。待機中はクリックでメニュー (タイトル・コンフィグ・スタート) を開く。ゲーム中は、ライフと生存時間を表示する -->
<template>
  <header
    class="flex h-10 shrink-0 items-center gap-4 bg-base-300 px-3 text-base-content select-none"
    :class="phase === 'idle' ? 'cursor-pointer hover:bg-base-200' : ''"
    @click="emit('toggle')"
  >
    <span class="font-bold">{{ nuisanceSurvivalMessages.title }}</span>

    <template v-if="state && phase !== 'idle'">
      <div class="flex items-center gap-2">
        <span class="text-xs opacity-70">{{ nuisanceSurvivalMessages.bar.life }}</span>
        <div class="h-3 w-44 overflow-hidden rounded bg-base-100">
          <div
            class="h-full transition-[width] duration-150"
            :class="lifeColor"
            :style="{ width: `${lifePercent}%` }"
          />
        </div>
        <span class="w-10 font-mono text-sm">{{ Math.ceil(state.life) }}</span>
      </div>
      <span class="font-mono text-lg">{{ formatClock(clockSeconds) }}</span>
      <span class="text-xs opacity-70">
        {{ nuisanceSurvivalMessages.bar.nuisances(state.nuisances.length, config?.maxNuisances ?? 0) }}
      </span>
      <span class="text-xs opacity-70">{{ nuisanceSurvivalMessages.bar.removed(state.removedCount) }}</span>
    </template>
    <span v-else class="text-xs opacity-60">{{ nuisanceSurvivalMessages.bar.openHint }}</span>

    <!-- コメントの購読の状態 (つながっていないと、コメントが邪魔者にならない) -->
    <span class="grow" />
    <span v-if="commentStatus === 'connecting'" class="text-xs opacity-60">
      {{ nuisanceSurvivalMessages.comments.connecting }}
    </span>
    <span v-else-if="commentStatus === 'error'" class="text-error flex items-center gap-2 text-xs" @click.stop>
      {{ nuisanceSurvivalMessages.comments.error }}
      <button type="button" class="btn btn-xs" @click="emit('reconnect')">
        {{ nuisanceSurvivalMessages.comments.retry }}
      </button>
    </span>
  </header>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { formatClock } from '../scripts/nuisanceRecord'
  import type { NuisanceConfigType } from '../scripts/nuisanceConfig'
  import type { GameState } from '../scripts/nuisanceEngine'
  import type { CommentStatus, NuisancePhase } from '../composables/useNuisanceSurvival'
  import { nuisanceSurvivalMessages } from '../maps/NuisanceSurvivalMessageMap'

  const props = defineProps<{
    phase: NuisancePhase
    state: GameState | null
    config: NuisanceConfigType | null
    commentStatus: CommentStatus
    getClock: () => number
  }>()
  const emit = defineEmits<{ toggle: []; reconnect: [] }>()

  const lifePercent = computed(() =>
    props.state && props.config ? Math.max(0, Math.min(100, (props.state.life / props.config.startLife) * 100)) : 0
  )
  const lifeColor = computed(() =>
    lifePercent.value > 50 ? 'bg-success' : lifePercent.value > 25 ? 'bg-warning' : 'bg-error'
  )

  // 生存時間の表示は、実時間で 0.25 秒ごとに更新する (ゲームオーバーのあとは、止まった時刻)
  const clockSeconds = ref(0)
  const refreshClock = () => (clockSeconds.value = props.getClock())
  const timer = setInterval(refreshClock, 250)
  watch(() => [props.phase, props.state?.over], refreshClock, { immediate: true })
  onBeforeUnmount(() => clearInterval(timer))
</script>
