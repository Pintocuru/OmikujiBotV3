<!-- src/console/game/UserRace/components/RaceResult.vue -->
<!-- 結果の表示 (1〜3位)。得点の加算は、ここのボタンから手動で行う -->
<template>
  <div class="rounded-box bg-base-100 p-6 text-base-content shadow-2xl">
    <h2 class="mb-3 text-center text-xl font-bold">{{ userRaceMessages.result.title }}</h2>

    <ol class="flex flex-col gap-2">
      <li v-for="r in results" :key="r.userId" class="flex items-center gap-3 text-lg">
        <span class="w-8 text-2xl">{{ MEDALS[r.rank - 1] }}</span>
        <span class="grow truncate font-bold">{{ r.userName }}</span>
        <span class="font-mono">{{ userRaceMessages.result.points(r.points) }}</span>
      </li>
    </ol>

    <div class="mt-4 flex flex-col items-center gap-2">
      <button type="button" class="btn btn-primary btn-sm" :disabled="applied || applying" @click="emit('apply')">
        {{
          applied
            ? userRaceMessages.result.applied
            : applying
              ? userRaceMessages.result.applying
              : userRaceMessages.result.apply
        }}
      </button>
      <p v-if="applyError" class="text-error text-xs break-all">{{ userRaceMessages.result.applyError(applyError) }}</p>
      <p v-else class="text-xs opacity-60">{{ userRaceMessages.result.note }}</p>
    </div>

    <!-- ゲームログへの記録 (自動。失敗したときだけ、再試行できる) -->
    <p v-if="recordStatus === 'saving'" class="mt-3 text-center text-xs opacity-60">
      {{ userRaceMessages.record.saving }}
    </p>
    <p v-else-if="recordStatus === 'saved'" class="mt-3 text-center text-xs opacity-60">
      {{ userRaceMessages.record.saved(streamId) }}
    </p>
    <p v-else-if="recordStatus === 'error'" class="text-error mt-3 flex items-center justify-center gap-2 text-xs">
      <span class="break-all">{{ userRaceMessages.record.error(recordError) }}</span>
      <button type="button" class="btn btn-xs" @click="emit('retryRecord')">{{ userRaceMessages.record.retry }}</button>
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { RaceResult } from '../scripts/raceEngine'
  import type { RecordStatus } from '../composables/useUserRace'
  import { userRaceMessages } from '../maps/UserRaceMessageMap'

  defineProps<{
    results: RaceResult[]
    applying: boolean
    applied: boolean
    applyError: string
    recordStatus: RecordStatus
    recordError: string
    streamId: string
  }>()
  const emit = defineEmits<{ apply: []; retryRecord: [] }>()

  const MEDALS = ['🥇', '🥈', '🥉']
</script>
