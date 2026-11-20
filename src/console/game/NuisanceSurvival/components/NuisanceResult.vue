<!-- src/console/game/NuisanceSurvival/components/NuisanceResult.vue -->
<!-- ゲームオーバーの結果: 生存時間・取り除いた数・ダメージを与えた人。ユーザーの得点は変えない (結果は、ゲームログに記録する) -->
<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/55 p-4">
    <div class="rounded-box w-full max-w-md bg-base-100 p-6 text-base-content shadow-2xl">
      <h2 class="text-center text-2xl font-black">{{ nuisanceSurvivalMessages.result.title }}</h2>

      <p class="mt-3 text-center">
        <span class="text-xs opacity-70">{{ nuisanceSurvivalMessages.result.survived }}</span>
        <span class="ml-2 text-3xl font-black">{{ formatSurvival(survivalSeconds) }}</span>
      </p>
      <p class="mt-1 text-center text-xs opacity-70">
        {{ nuisanceSurvivalMessages.result.removed(state.removedCount) }}
      </p>

      <h3 class="mt-4 text-sm font-bold">{{ nuisanceSurvivalMessages.result.ranking }}</h3>
      <ol v-if="top.length" class="mt-2 flex flex-col gap-1.5">
        <li v-for="(c, i) in top" :key="c.userId" class="flex items-center gap-2">
          <span class="w-6 text-center text-lg">{{ MEDALS[i] ?? i + 1 }}</span>
          <UserIcon :src="c.profileImage" :userName="c.userName" />
          <span class="grow truncate font-bold">{{ c.userName }}</span>
          <span class="font-mono text-sm">{{ nuisanceSurvivalMessages.result.damage(Math.round(c.damage)) }}</span>
        </li>
      </ol>
      <p v-else class="mt-2 text-xs opacity-60">{{ nuisanceSurvivalMessages.result.none }}</p>

      <!-- ゲームログへの記録 (自動。失敗したときだけ、再試行できる) -->
      <p v-if="recordStatus === 'saving'" class="mt-3 text-center text-xs opacity-60">
        {{ nuisanceSurvivalMessages.record.saving }}
      </p>
      <p v-else-if="recordStatus === 'saved'" class="mt-3 text-center text-xs opacity-60">
        {{ nuisanceSurvivalMessages.record.saved(streamId) }}
      </p>
      <p v-else-if="recordStatus === 'error'" class="text-error mt-3 flex items-center justify-center gap-2 text-xs">
        <span class="break-all">{{ nuisanceSurvivalMessages.record.error(recordError) }}</span>
        <button type="button" class="btn btn-xs" @click="emit('retryRecord')">
          {{ nuisanceSurvivalMessages.record.retry }}
        </button>
      </p>

      <div class="mt-5 flex justify-center gap-3">
        <button type="button" class="btn btn-primary" @click="emit('again')">
          {{ nuisanceSurvivalMessages.result.again }}
        </button>
        <button type="button" class="btn btn-ghost" @click="emit('toMenu')">
          {{ nuisanceSurvivalMessages.result.toMenu }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import UserIcon from '@/console/common/components/UserIcon.vue'
  import type { Contribution, GameState } from '../scripts/nuisanceEngine'
  import { formatSurvival } from '../scripts/nuisanceRecord'
  import type { RecordStatus } from '../composables/useNuisanceSurvival'
  import { nuisanceSurvivalMessages } from '../maps/NuisanceSurvivalMessageMap'

  const props = defineProps<{
    state: GameState
    ranking: Contribution[]
    recordStatus: RecordStatus
    recordError: string
    streamId: string
  }>()
  const emit = defineEmits<{ again: []; toMenu: []; retryRecord: [] }>()

  const MEDALS = ['🥇', '🥈', '🥉']
  const TOP_COUNT = 5
  const survivalSeconds = computed(() => props.state.endedAt ?? props.state.elapsed)
  const top = computed(() => props.ranking.filter((c) => Math.round(c.damage) > 0).slice(0, TOP_COUNT))
</script>
