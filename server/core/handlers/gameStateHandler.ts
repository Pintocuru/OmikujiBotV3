// server/core/handlers/gameStateHandler.ts
import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, badRequest, fail, guard } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import { withLock } from '@server/core/utils/mutex'
import { DIR_NAME, HTTP } from '@server/core/constants'
import {
  GameLogAppendRequestSchema,
  GameStateSchema,
  GameStateType,
  StreamGameFileSchema,
  StreamGameFileType,
  StreamIdSchema,
  GameStateListItemType,
  UserStatsSchema,
} from '@/types/api'

const toFileName = (streamId: string) => `${streamId}.json`

/**
 * 保存済みの配信一覧 (更新日時の新しい順)
 */
export async function listGameStates(): Promise<ApiResult> {
  return guard('List game states', 'Failed to list game states', async () => {
    const files = await fileSystem.getFileList(DIR_NAME.streams)

    const items: GameStateListItemType[] = files
      .filter((f) => !f.name.includes('/') && f.name.endsWith('.json'))
      .map((f) => ({ streamId: f.name.replace(/\.json$/, ''), updatedAt: Date.parse(f.modified) }))
      .filter((item) => StreamIdSchema.safeParse(item.streamId).success)

    return ok(items)
  })
}

/**
 * 1配信ぶんのゲームステートを取得
 * eventKey を指定すると、その eventKey の GameState だけを返す
 */
export async function loadGameState(streamId: string | undefined, eventKey?: string): Promise<ApiResult> {
  const id = StreamIdSchema.safeParse(streamId)
  if (!id.success) return badRequest('Invalid streamId')

  return guard<unknown>(
    'Load game state',
    'Failed to load game state',
    async () => {
      const file = StreamGameFileSchema.parse(await fileSystem.loadFile(DIR_NAME.streams, toFileName(id.data)))

      if (eventKey === undefined) return ok(file)

      const state = file.states[eventKey]
      if (!state) return fail(HTTP.NOT_FOUND, 'Game state not found')
      return ok({ ...file, states: { [eventKey]: state } })
    },
    { notFound: 'Game state not found' }
  )
}

/**
 * ログを1件追記する (1配信 = 1ファイル、eventKey ごとに state を持つ)
 * - 同じ log.id が保存済みなら何もしない (appended: false)
 * - userMap の統計 (回数・累計ポイント・自己ベスト) もここで更新する
 *   totalWins は、ランキングでは勝敗を使わないため更新しない
 */
export async function appendGameLog(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(GameLogAppendRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  const { streamId, eventKey, log } = parsed.data

  return withLock(`game-state:${streamId}`, () =>
    guard('Append game log', 'Failed to append game log', async () => {
      const fileName = toFileName(streamId)
      const now = Date.now()

      // 既存ファイルがあれば引き継ぐ。読めない場合は上書きせずエラーにする
      let current: StreamGameFileType | null = null
      try {
        current = StreamGameFileSchema.parse(await fileSystem.loadFile(DIR_NAME.streams, fileName))
      } catch (error: any) {
        if (error?.code !== 'ENOENT') throw error
      }

      const state = current?.states[eventKey] ?? GameStateSchema.parse({ eventKey })

      // 重複 (同じ log.id) は保存しない
      if (state.logs.some((saved) => saved.id === log.id)) {
        return ok({ streamId, eventKey, updatedAt: current?.updatedAt ?? now, appended: false })
      }

      // userId をキーに使うので、代入ではなく computed key のスプレッドで更新する
      const previous = state.userMap[log.userId] ?? UserStatsSchema.parse({ userId: log.userId })
      const nextState: GameStateType = {
        ...state,
        logs: [...state.logs, log],
        userMap: {
          ...state.userMap,
          [log.userId]: {
            ...previous,
            totalDraws: previous.totalDraws + 1,
            totalPoints: previous.totalPoints + log.score,
            bestScore: Math.max(previous.bestScore, log.score),
          },
        },
      }

      const next: StreamGameFileType = {
        streamId,
        createdAt: current?.createdAt ?? now,
        updatedAt: now,
        states: { ...current?.states, [eventKey]: nextState },
      }

      await fileSystem.saveFile(DIR_NAME.streams, fileName, JSON.stringify(next))
      console.info(`💾 Appended game log: ${fileName} (eventKey: ${eventKey}, userId: ${log.userId})`)
      return ok({ streamId, eventKey, updatedAt: now, appended: true })
    })
  )
}

/**
 * 1配信ぶんのゲームステートを削除
 */
export async function deleteGameState(streamId: string | undefined): Promise<ApiResult> {
  const id = StreamIdSchema.safeParse(streamId)
  if (!id.success) return badRequest('Invalid streamId')

  return withLock(`game-state:${id.data}`, () =>
    guard(
      'Delete game state',
      'Failed to delete game state',
      async () => {
        await fileSystem.deleteFile(DIR_NAME.streams, toFileName(id.data))
        console.info(`🗑️ Deleted game state: ${id.data}`)
        return ok({ message: 'Game state deleted successfully' })
      },
      { notFound: 'Game state not found' }
    )
  )
}
