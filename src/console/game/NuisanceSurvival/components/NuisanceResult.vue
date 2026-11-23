<!-- src/console/game/NuisanceSurvival/components/NuisanceResult.vue -->
<!-- ゲームオーバーの結果: 生存時間・最大連鎖・押し出した数・時間を生んだ人。ユーザーの得点は変えない (結果は、ゲームログに記録する) -->
<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/55 p-4">
    <div class="rounded-box w-full max-w-md bg-base-100 p-6 text-base-content shadow-2xl">
      <h2 class="text-center text-2xl font-black">{{ oshikuraChainMessages.result.title }}</h2>

      <p class="mt-3 text-center">
        <span class="text-xs opacity-70">{{ oshikuraChainMessages.result.survived }}</span>
        <span class="ml-2 text-3xl font-black">{{ formatSurvival(survivalSeconds) }}</span>
      </p>
      <p class="mt-1 text-center text-xs opacity-70">
        {{ oshikuraChainMessages.result.bestChain(state.bestChain) }} /
        {{ oshikuraChainMessages.result.removed(state.removedCount, state.removedWordCount) }}
      </p>

      <h3 class="mt-4 text-sm font-bold">{{ oshikuraChainMessages.result.ranking }}</h3>
      <ol v-if="top.length" class="mt-2 flex flex-col gap-1.5">
        <li v-for="(c, i) in top" :key="c.userId" class="flex items-center gap-2">
          <span class="w-6 text-center text-lg">{{ MEDALS[i] ?? i + 1 }}</span>
          <UserIcon :src="c.profileImage" :userName="c.userName" />
          <span class="grow truncate font-bold">{{ c.userName }}</span>
          <span class="font-mono text-sm">{{ oshikuraChainMessages.result.seconds(Math.round(c.seconds)) }}</span>
        </li>
      </ol>
      <p v-else class="mt-2 text-xs opacity-60">{{ oshikuraChainMessages.result.none }}</p>

      <!-- ゲームログへの記録 (自動。失敗したときだけ、再試行できる) -->
      <p v-if="recordStatus === 'saving'" class="mt-3 text-center text-xs opacity-60">
        {{ oshikuraChainMessages.record.saving }}
      </p>
      <p v-else-if="recordStatus === 'saved'" class="mt-3 text-center text-xs opacity-60">
        {{ oshikuraChainMessages.record.saved(streamId) }}
      </p>
      <p v-else-if="recordStatus === 'error'" class="text-error mt-3 flex items-center justify-center gap-2 text-xs">
        <span class="break-all">{{ oshikuraChainMessages.record.error(recordError) }}</span>
        <button type="button" class="btn btn-xs" @click="emit('retryRecord')">
          {{ oshikuraChainMessages.record.retry }}
        </button>
      </p>

      <div class="mt-5 flex justify-center gap-3">
        <button type="button" class="btn btn-primary" @click="emit('again')">
          {{ oshikuraChainMessages.result.again }}
        </button>
        <button type="button" class="btn btn-ghost" @click="emit('toMenu')">
          {{ oshikuraChainMessages.result.toMenu }}
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
  import type { RecordStatus } from '../composables/useOshikuraChain'
  import { oshikuraChainMessages } from '../maps/OshikuraChainMessageMap'

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
  const top = computed(() => props.ranking.filter((c) => Math.round(c.seconds) > 0).slice(0, TOP_COUNT))
</script>
