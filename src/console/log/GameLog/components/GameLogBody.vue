<!-- src/console/log/GameLog/components/GameLogBody.vue -->
<!-- ゲームの記録画面の本体: 配信一覧 / イベント(eventKey) の選択 / ランキング・ユーザー別・ログの表示 -->
<template>
  <main class="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[18rem_1fr]">
    <aside>
      <StreamList
        :streams="streams"
        :selectedStreamId="selectedStreamId"
        @select="emit('selectStream', $event)"
        @remove="emit('removeStream', $event)"
      />
    </aside>

    <section class="flex min-w-0 flex-col gap-3">
      <p v-if="status === 'loading'" class="py-8 text-center opacity-60">読み込み中...</p>
      <p v-else-if="!selectedStreamId" class="py-8 text-center opacity-60">
        配信を選ぶと、ゲームの記録を表示します。GameRanking が動くと、ここに記録が増えていきます。
      </p>
      <p v-else-if="eventKeys.length === 0" class="py-8 text-center opacity-60">
        この配信には、まだゲームの記録がありません
      </p>

      <template v-else>
        <!-- eventKey (ゲームごと) -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm opacity-60">イベント</span>
          <button
            v-for="key in eventKeys"
            :key="key"
            class="btn btn-sm"
            :class="key === selectedEventKey ? 'btn-primary' : 'btn-outline'"
            @click="emit('selectEventKey', key)"
          >
            {{ key }}
            <span class="badge badge-sm">{{ file?.states[key]?.logs.length ?? 0 }}</span>
          </button>
        </div>

        <!-- 表示の切り替え -->
        <div role="tablist" class="tabs tabs-bordered">
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

        <template v-if="currentState">
          <RankingTable v-if="view === 'ranking'" :state="currentState" />
          <UserStatsTable v-else-if="view === 'users'" :state="currentState" />
          <LogList v-else :state="currentState" />
        </template>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { GameStateListItemType, GameStateType, StreamGameFileType } from '@/types/api'
  import type { ConsoleStatus } from '@/console/types'
  import StreamList from './StreamList.vue'
  import RankingTable from './RankingTable.vue'
  import UserStatsTable from './UserStatsTable.vue'
  import LogList from './LogList.vue'

  defineProps<{
    status: ConsoleStatus
    streams: GameStateListItemType[]
    selectedStreamId: string | null
    file: StreamGameFileType | null
    eventKeys: string[]
    selectedEventKey: string | null
    currentState: GameStateType | null
  }>()

  const emit = defineEmits<{
    selectStream: [streamId: string]
    removeStream: [streamId: string]
    selectEventKey: [eventKey: string]
  }>()

  const views = { ranking: 'ランキング', users: 'ユーザー別', logs: 'ログ' } as const
  const view = ref<keyof typeof views>('ranking')
</script>
