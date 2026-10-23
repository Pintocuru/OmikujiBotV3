<!-- src/console/components/GameLogsView.vue -->
<!-- ゲームの記録 (配信ごとのランキング・ユーザー別・ログ) を見る画面 -->
<template>
  <div class="flex flex-col">
    <!-- ツールバー -->
    <div class="flex flex-wrap items-center justify-end gap-3 px-4 pt-3">
      <span class="badge" :class="statusBadge.class">{{ statusBadge.text }}</span>
      <span v-if="lastLoadedAt" class="hidden text-xs opacity-60 sm:inline">更新 {{ formatTime(lastLoadedAt) }}</span>
      <label class="label cursor-pointer gap-2 text-sm">
        <input v-model="autoRefresh" type="checkbox" class="toggle toggle-sm toggle-primary" />
        自動更新
      </label>
      <button class="btn btn-sm" @click="refresh">更新</button>
    </div>

    <StatusNotice :status="status" :errorMessage="errorMessage" />

    <!-- 本体 -->
    <main v-if="status === 'loading' || status === 'online'" class="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[18rem_1fr]">
      <aside>
        <StreamList
          :streams="streams"
          :selectedStreamId="selectedStreamId"
          @select="selectStream"
          @remove="removeStream"
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
              @click="selectEventKey(key)"
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
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useLiveConsole } from '../composables/useLiveConsole'
  import { formatTime } from '../scripts/summarizeState'
  import StatusNotice from './StatusNotice.vue'
  import StreamList from './StreamList.vue'
  import RankingTable from './RankingTable.vue'
  import UserStatsTable from './UserStatsTable.vue'
  import LogList from './LogList.vue'

  const {
    streams,
    selectedStreamId,
    file,
    eventKeys,
    selectedEventKey,
    currentState,
    status,
    errorMessage,
    lastLoadedAt,
    autoRefresh,
    refresh,
    selectStream,
    selectEventKey,
    removeStream,
  } = useLiveConsole()

  const views = { ranking: 'ランキング', users: 'ユーザー別', logs: 'ログ' } as const
  const view = ref<keyof typeof views>('ranking')

  const statusBadge = computed(() => {
    switch (status.value) {
      case 'online':
        return { text: '接続中', class: 'badge-success' }
      case 'offline':
        return { text: '未接続', class: 'badge-warning' }
      case 'error':
        return { text: 'エラー', class: 'badge-error' }
      default:
        return { text: '読み込み中', class: 'badge-ghost' }
    }
  })
</script>
