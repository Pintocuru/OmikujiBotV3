// src/ui/GameRanking/scripts/useGameLogSaver.ts
import { Ref, watch } from 'vue'
import { BotMessageExtraType } from '@/generator/types'
import { gameStateApi } from '@/manager/services/gameStateApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import { toGameLog, toRankingMessage } from './toRankingMessage'

/**
 * 配信ID (ファイル名になる): 起動した日時 例 '20261020-2130'
 * OBS のリロードで別の配信ID(=別ファイル)になるが、頻繁には起こらないため許容している。
 */
export const createStreamId = (now: Date = new Date()): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  return `${date}-${pad(now.getHours())}${pad(now.getMinutes())}`
}

/**
 * ランキングに関係するメッセージを受け取るたびに、API でログを1件追記する。
 * - 1配信 = 1ファイル (streamId は起動時に決める)
 * - 順序を保つため、送信は1件ずつ直列で行う
 * - サーバがない場合 (プラグイン未起動) は、表示に影響させず警告だけ出す
 *
 * TODO(LiveConsole): 送信に失敗したログは再送しない。必要になったら再送キューを足す。
 */
export const useGameLogSaver = (messages: Ref<BotMessageExtraType[]>, streamId: string = createStreamId()) => {
  const attempted = new Set<string>() // 送信を試みた id (同じメッセージを二度送らない)
  let queue: Promise<void> = Promise.resolve()
  let warnedConnection = false

  const send = async (extra: BotMessageExtraType): Promise<void> => {
    const ranking = toRankingMessage(extra)
    if (!ranking) return

    try {
      await gameStateApi.appendGameLog(streamId, ranking.eventKey, toGameLog(ranking))
    } catch (error) {
      if (error instanceof ConnectionError) {
        if (!warnedConnection) console.warn('[GameRanking] サーバに接続できないため、ゲームログを保存できません')
        warnedConnection = true
        return
      }
      console.error('[GameRanking] ゲームログの保存に失敗しました', error)
    }
  }

  watch(
    messages,
    (list) => {
      for (const extra of list) {
        if (attempted.has(extra.id)) continue
        attempted.add(extra.id)
        queue = queue.then(() => send(extra))
      }
    },
    { immediate: true, deep: false }
  )

  return { streamId }
}
