// src/console/composables/useLiveConsole.ts
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { gameStateApi } from '@/manager/services/gameStateApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import type { GameStateListItemType, GameStateType, StreamGameFileType } from '@/types/api'

export type ConsoleStatus = 'loading' | 'online' | 'offline' | 'error'

const REFRESH_INTERVAL_MS = 5000

/**
 * LiveConsole のデータ (配信一覧・選択中の配信・eventKey) と、自動更新
 * - サーバーに接続できないときは status が 'offline' になる (画面で案内を出す)
 */
export function useLiveConsole() {
  const streams = ref<GameStateListItemType[]>([])
  const selectedStreamId = ref<string | null>(null)
  const file = ref<StreamGameFileType | null>(null)
  const selectedEventKey = ref<string | null>(null)

  const status = ref<ConsoleStatus>('loading')
  const errorMessage = ref('')
  const lastLoadedAt = ref(0)
  const autoRefresh = ref(true)

  let timer: ReturnType<typeof setInterval> | undefined
  let requestId = 0 // 古いレスポンスで画面を上書きしないため

  const eventKeys = computed(() => Object.keys(file.value?.states ?? {}))
  const currentState = computed<GameStateType | null>(() => {
    const key = selectedEventKey.value
    return key && file.value ? (file.value.states[key] ?? null) : null
  })

  const handleError = (error: unknown) => {
    if (error instanceof ConnectionError) {
      status.value = 'offline'
      errorMessage.value = ''
    } else {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  /** 選択中の eventKey が消えていたら、先頭に合わせる */
  const syncEventKey = () => {
    const keys = eventKeys.value
    if (selectedEventKey.value && keys.includes(selectedEventKey.value)) return
    selectedEventKey.value = keys[0] ?? null
  }

  const loadFile = async (streamId: string) => {
    const id = ++requestId
    const loaded = await gameStateApi.loadGameState(streamId)
    if (id !== requestId) return
    file.value = loaded
    syncEventKey()
  }

  /** 一覧と、選択中の配信を読み込む */
  const refresh = async () => {
    try {
      streams.value = await gameStateApi.listGameStates()
      if (selectedStreamId.value && !streams.value.some((s) => s.streamId === selectedStreamId.value)) {
        selectedStreamId.value = null
        file.value = null
      }
      if (!selectedStreamId.value) selectedStreamId.value = streams.value[0]?.streamId ?? null
      if (selectedStreamId.value) await loadFile(selectedStreamId.value)
      else {
        file.value = null
        syncEventKey()
      }
      status.value = 'online'
      errorMessage.value = ''
      lastLoadedAt.value = Date.now()
    } catch (error) {
      handleError(error)
    }
  }

  const selectStream = async (streamId: string) => {
    selectedStreamId.value = streamId
    selectedEventKey.value = null
    file.value = null
    try {
      await loadFile(streamId)
      status.value = 'online'
      lastLoadedAt.value = Date.now()
    } catch (error) {
      handleError(error)
    }
  }

  const selectEventKey = (eventKey: string) => {
    selectedEventKey.value = eventKey
  }

  const removeStream = async (streamId: string) => {
    try {
      await gameStateApi.deleteGameState(streamId)
      if (selectedStreamId.value === streamId) selectedStreamId.value = null
      await refresh()
    } catch (error) {
      handleError(error)
    }
  }

  const stopTimer = () => {
    if (timer) clearInterval(timer)
    timer = undefined
  }
  const startTimer = () => {
    stopTimer()
    timer = setInterval(() => {
      if (autoRefresh.value && !document.hidden) void refresh()
    }, REFRESH_INTERVAL_MS)
  }

  onMounted(() => {
    void refresh()
    startTimer()
  })
  onBeforeUnmount(stopTimer)

  return {
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
  }
}
