// src/ui/LiverBingo/composables/useLiverBingoSync.ts
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { bingoApi } from '@/manager/services/bingoApi'
import type { LiverBingoCommandType, LiverBingoSnapshotType } from '@/types/api'
import type { LiverBingoBoardState } from './useLiverBingo'

/** LiveConsole の命令を、サーバーへ確認する間隔(ミリ秒)。ポン出しと同じ */
const COMMAND_POLL_INTERVAL_MS = 500
/** カードの写しを、変化がなくても送る間隔(ミリ秒)。LiveConsole が「OBS が動いている」と分かるため */
const HEARTBEAT_INTERVAL_MS = 5000
/** カードの写しを、変化のあとにまとめて送るまでの待ち(ミリ秒) */
const SNAPSHOT_DEBOUNCE_MS = 200

/**
 * OBS のカードを、LiveConsole と同期する
 * - 0.5 秒ごとにサーバーの命令を取りに行き、新しいものを順に実行する
 * - カードが変わったら、写しをサーバーへ送る(LiveConsole の表示用)
 * - サーバーがない・つながらないときは、静かに何もしない(OBS だけで使える)
 */
export const useLiverBingoSync = (board: LiverBingoBoardState) => {
  let commandTimer: ReturnType<typeof setInterval> | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  let snapshotTimer: ReturnType<typeof setTimeout> | null = null
  /** 最後に受け取った命令の seq。null = まだサーバーから基準を受け取っていない */
  let lastSeen: number | null = null
  let running = false
  let stopped = false

  const apply = (command: LiverBingoCommandType) => {
    switch (command.type) {
      case 'increment':
        return board.increment(command.index)
      case 'decrement':
        return board.decrement(command.index)
      case 'reroll':
        return board.reroll(command.index)
      case 'setCell':
        return board.patchCell(command.index, command.patch)
      case 'focus':
        return board.focus(command.index)
      case 'reset':
        return board.reset()
    }
  }

  const buildSnapshot = (): LiverBingoSnapshotType => ({
    cardSize: board.cardSize.value,
    cells: board.items.value.map((item, index) => ({
      title: item.title,
      progress: board.progress.value[index] ?? 0,
      target: item.target,
      unit: item.unit,
      fixed: board.fixedCells.value.has(index),
    })),
    focus: board.focusCell.value,
    lineCount: board.lineCount.value,
  })

  const pushSnapshot = async () => {
    try {
      await bingoApi.saveSnapshot(buildSnapshot())
    } catch {
      // サーバーがない (OBS のみで使っているなど) ときは何もしない
    }
  }

  const scheduleSnapshot = () => {
    if (snapshotTimer) clearTimeout(snapshotTimer)
    snapshotTimer = setTimeout(() => void pushSnapshot(), SNAPSHOT_DEBOUNCE_MS)
  }

  /**
   * 1 回ぶんの取得
   * lastSeen が未設定のときは since を付けずに問い合わせ、サーバーの最後の seq を基準にする
   * (OBS を開き直したときに、過去の命令を再生しないため)
   */
  const poll = async () => {
    if (running || stopped) return
    running = true
    try {
      const result = await bingoApi.loadCommands(lastSeen ?? undefined)
      if (stopped) return

      const isBaseline = lastSeen === null
      // 二重に実行しないよう、実行より先に lastSeen を更新する
      lastSeen = result.latest
      if (isBaseline) {
        await pushSnapshot() // つながったことを LiveConsole に知らせる
        return
      }
      result.commands.forEach((entry) => apply(entry.command))
    } catch {
      // サーバーがない (OBS のみで使っているなど) ときは何もしない
    } finally {
      running = false
    }
  }

  onMounted(() => {
    stopped = false
    void poll()
    commandTimer = setInterval(() => void poll(), COMMAND_POLL_INTERVAL_MS)
    heartbeatTimer = setInterval(() => void pushSnapshot(), HEARTBEAT_INTERVAL_MS)
  })

  onBeforeUnmount(() => {
    stopped = true
    if (commandTimer) clearInterval(commandTimer)
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    if (snapshotTimer) clearTimeout(snapshotTimer)
  })

  // カードが変わったら写しを送る
  watch([board.items, board.progress, board.focusCell], scheduleSnapshot, { deep: true })
}
