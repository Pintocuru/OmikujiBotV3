// src/console/bingo/composables/useBingoConsole.ts
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { bingoApi } from '@/manager/services/bingoApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import type { LiverBingoCellPatchType, LiverBingoCommandType, LiverBingoSnapshotType } from '@/types/api'
import { ConsoleStatus } from '@/console/types'

/** OBS のカードの写しを、サーバーへ確認する間隔(ミリ秒) */
const SNAPSHOT_POLL_INTERVAL_MS = 1000
/** 命令を送ったあと、OBS が実行して写しを送り返すのを待ってから、もう一度確認する待ち(ミリ秒) */
const REFRESH_AFTER_SEND_MS = [700, 1500]
/** OBS からの写しがこれより古いとき「OBS からの更新がない」とする(OBS は 5 秒ごとに送る) */
const OBS_STALE_MS = 15000

/**
 * ライバービンゴ操作画面のデータ
 * - snapshot: OBS のカードの写し(OBS が変化のたびにサーバーへ送ったもの)
 * - send: OBS への命令。OBS が 0.5 秒ごとに受け取って実行する
 */
export function useBingoConsole() {
  const snapshot = ref<LiverBingoSnapshotType | null>(null)
  const updatedAt = ref(0)
  const now = ref(Date.now())
  const status = ref<ConsoleStatus>('loading')
  const errorMessage = ref('')

  /** OBS からの写しが、最近届いているか */
  const obsActive = computed(() => snapshot.value !== null && now.value - updatedAt.value < OBS_STALE_MS)
  const obsAgeSeconds = computed(() => Math.max(0, Math.round((now.value - updatedAt.value) / 1000)))

  const handleError = (error: unknown) => {
    if (error instanceof ConnectionError) {
      status.value = 'offline'
      errorMessage.value = ''
    } else {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  const refresh = async () => {
    try {
      const result = await bingoApi.loadSnapshot()
      // 変わっていないときは差し替えない(入力中の欄を再描画で上書きしないため)
      if (JSON.stringify(result.snapshot) !== JSON.stringify(snapshot.value)) snapshot.value = result.snapshot
      updatedAt.value = result.updatedAt
      status.value = 'online'
      errorMessage.value = ''
    } catch (error) {
      handleError(error)
    }
  }

  const refreshTimers: ReturnType<typeof setTimeout>[] = []

  const send = async (command: LiverBingoCommandType) => {
    try {
      await bingoApi.sendCommand(command)
      status.value = 'online'
      errorMessage.value = ''
      REFRESH_AFTER_SEND_MS.forEach((ms) => refreshTimers.push(setTimeout(() => void refresh(), ms)))
    } catch (error) {
      handleError(error)
    }
  }

  // ---- 命令 ----
  const increment = (index: number) => send({ type: 'increment', index })
  const decrement = (index: number) => send({ type: 'decrement', index })
  const reroll = (index: number) => send({ type: 'reroll', index })
  const patchCell = (index: number, patch: LiverBingoCellPatchType) => send({ type: 'setCell', index, patch })
  const focus = (index: number | null) => send({ type: 'focus', index })
  const reset = () => send({ type: 'reset' })

  /** 未達成のマスから 1 つ選んで注目する(全部達成済みなら何もしない) */
  const focusRandom = () => {
    const cells = snapshot.value?.cells ?? []
    const open = cells.flatMap((cell, index) => (cell.progress >= cell.target ? [] : [index]))
    if (open.length === 0) return
    return focus(open[Math.floor(Math.random() * open.length)])
  }

  let pollTimer: ReturnType<typeof setInterval> | undefined
  let tickTimer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    void refresh()
    pollTimer = setInterval(() => void refresh(), SNAPSHOT_POLL_INTERVAL_MS)
    tickTimer = setInterval(() => (now.value = Date.now()), 1000)
  })

  onBeforeUnmount(() => {
    clearInterval(pollTimer)
    clearInterval(tickTimer)
    refreshTimers.forEach((timer) => clearTimeout(timer))
  })

  return {
    snapshot,
    status,
    errorMessage,
    obsActive,
    obsAgeSeconds,
    increment,
    decrement,
    reroll,
    patchCell,
    focus,
    focusRandom,
    reset,
  }
}
