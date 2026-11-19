<!-- src/console/log/GameLog/GameLog.vue -->
<!-- ゲームの記録 (配信ごとのランキング・ユーザー別・ログ) を見る画面 -->
<template>
  <div class="flex flex-col">
    <GameLogToolbar
      v-model:autoRefresh="autoRefresh"
      :status="status"
      :lastLoadedAt="lastLoadedAt"
      :adding="adding"
      :mockError="mockError"
      @refresh="refresh"
      @addMock="addMockLogs"
    />

    <StatusNotice :status="status" :errorMessage="errorMessage" />

    <GameLogBody
      v-if="status === 'loading' || status === 'online'"
      :status="status"
      :streams="streams"
      :selectedStreamId="selectedStreamId"
      :file="file"
      :eventKeys="eventKeys"
      :selectedEventKey="selectedEventKey"
      :currentState="currentState"
      @selectStream="selectStream"
      @removeStream="removeStream"
      @selectEventKey="selectEventKey"
    />
  </div>
</template>

<script setup lang="ts">
  import StatusNotice from '@/console/common/components/StatusNotice.vue'
  import GameLogToolbar from './components/GameLogToolbar.vue'
  import GameLogBody from './components/GameLogBody.vue'
  import { useGameLog } from './composables/useGameLog'
  import { useMockGameLogs } from './composables/useMockGameLogs'

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
  } = useGameLog()

  // 開発サーバー専用: テスト用の記録を追加して、追加した配信・イベントを開く
  const { adding, mockError, addMockGameLogs } = useMockGameLogs()
  const addMockLogs = async () => {
    const added = await addMockGameLogs(selectedStreamId.value, selectedEventKey.value)
    if (!added) return
    await refresh()
    await selectStream(added.streamId)
    selectEventKey(added.eventKey)
  }
</script>
