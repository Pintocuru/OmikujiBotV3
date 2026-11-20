import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, badRequest, fail, guard } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import { withLock } from '@server/core/utils/mutex'
import { DIR_NAME, HTTP } from '@server/core/constants'
import { isSafeRecordKey } from '@server/core/utils/validation'
import {
  GameLogAppendRequestSchema,
  GameLogsAppendRequestSchema,
  GameLogType,
  GameStateSchema,
  GameStateType,
  StreamGameFileSchema,
  StreamGameFileType,
  StreamIdSchema,
  GameStateListItemType,
  UserStatsSchema,
} from '@/types/api'

const toFileName = (streamId: string) => `${streamId}.json`

// userMap に保存するアイコンは HTTP / HTTPS の URL のみ
// base64 (コメントテスター) はファイルが膨らむので保存しない
const toStorableProfileImage = (value: string | undefined): string | undefined =>
  value && /^https?:\/\//i.test(value) ? value : undefined

/**
 * 保存済みの配信一覧 (更新日時の新しい順)
 */
export async function listGameStates(): Promise<ApiResult> {
  return guard('List game states', 'Failed to list game states', async () => {
    const files = await fileSystem.getFileList(DIR_NAME.streams, { withMeta: false, recursive: false })

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

      const state = Object.hasOwn(file.states, eventKey) ? file.states[eventKey] : undefined
      if (!state) return fail(HTTP.NOT_FOUND, 'Game state not found')
      return ok({ ...file, states: { [eventKey]: state } })
    },
    { notFound: 'Game state not found' }
  )
}

/**
 * ログを追記する共通の処理 (呼び出し側が withLock と guard の中で呼ぶ)
 * - 1配信 = 1ファイル、eventKey ごとに state を持つ
 * - 同じ log.id が保存済み (または、リクエスト内で重複) なら、そのログは保存しない
 * - userMap の統計 (回数・累計ポイント・自己ベスト) とアイコンも更新する
 * - profileImage は HTTP / HTTPS の URL のみ保存する
 * - totalWins は、ランキングでは勝敗を使わないため更新しない
 * - 保存するログが 1 件もないときは、ファイルを書き換えない
 */
async function appendLogs(
  streamId: string,
  eventKey: string,
  logs: GameLogType[],
  profileImage?: string
): Promise<{ updatedAt: number; appendedCount: number; skippedCount: number }> {
  const fileName = toFileName(streamId)
  const now = Date.now()

  // 既存ファイルがあれば引き継ぐ。読めない場合は上書きせずエラーにする
  let current: StreamGameFileType | null = null
  try {
    current = StreamGameFileSchema.parse(await fileSystem.loadFile(DIR_NAME.streams, fileName))
  } catch (error: any) {
    if (error?.code !== 'ENOENT') throw error
  }

  const state =
    current && Object.hasOwn(current.states, eventKey) ? current.states[eventKey] : GameStateSchema.parse({ eventKey })

  const savedIds = new Set(state.logs.map((saved) => saved.id))
  const newLogs = logs.filter((log) => !savedIds.has(log.id) && (savedIds.add(log.id), true))

  if (newLogs.length === 0) {
    return { updatedAt: current?.updatedAt ?? now, appendedCount: 0, skippedCount: logs.length }
  }

  // userId をキーに使うので、代入ではなく computed key のスプレッドで更新する
  let userMap = state.userMap

  for (const log of newLogs) {
    const previous = Object.hasOwn(userMap, log.userId)
      ? userMap[log.userId]
      : UserStatsSchema.parse({ userId: log.userId })

    userMap = {
      ...userMap,
      [log.userId]: {
        ...previous,
        totalDraws: previous.totalDraws + 1,
        totalPoints: previous.totalPoints + log.score,
        bestScore: Math.max(previous.bestScore, log.score),
        ...(profileImage ? { profileImage } : {}),
      },
    }
  }

  const nextState: GameStateType = {
    ...state,
    logs: [...state.logs, ...newLogs],
    userMap,
  }

  const next: StreamGameFileType = {
    streamId,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
    states: { ...current?.states, [eventKey]: nextState },
  }

  await fileSystem.saveFile(DIR_NAME.streams, fileName, JSON.stringify(next))
  console.info(`💾 Appended game log: ${fileName} (eventKey: ${eventKey}, logs: ${newLogs.length})`)

  return {
    updatedAt: now,
    appendedCount: newLogs.length,
    skippedCount: logs.length - newLogs.length,
  }
}

/**
 * ログを1件追記する
 */
export async function appendGameLog(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(GameLogAppendRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  const { streamId, eventKey, log } = parsed.data
  const profileImage = toStorableProfileImage(parsed.data.profileImage)

  if (!isSafeRecordKey(eventKey)) return badRequest('Invalid eventKey')
  if (!isSafeRecordKey(log.userId)) return badRequest('Invalid userId')

  return withLock(`game-state:${streamId}`, () =>
    guard('Append game log', 'Failed to append game log', async () => {
      const result = await appendLogs(streamId, eventKey, [log], profileImage)

      // append-game-logs と同じ項目 (appendedCount / skippedCount) も返す
      return ok({
        streamId,
        eventKey,
        updatedAt: result.updatedAt,
        appended: result.appendedCount > 0,
        appendedCount: result.appendedCount,
        skippedCount: result.skippedCount,
      })
    })
  )
}

/**
 * ログを複数件まとめて追記する (1回の書き込み。全件保存されるか、1件も保存されないか)
 */
export async function appendGameLogs(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(GameLogsAppendRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  const { streamId, eventKey, logs } = parsed.data
  const profileImage = toStorableProfileImage(parsed.data.profileImage)

  if (!isSafeRecordKey(eventKey)) return badRequest('Invalid eventKey')
  if (logs.some((log) => !isSafeRecordKey(log.userId))) return badRequest('Invalid userId')

  return withLock(`game-state:${streamId}`, () =>
    guard('Append game logs', 'Failed to append game logs', async () => {
      const result = await appendLogs(streamId, eventKey, logs, profileImage)
      // append-game-log と同じ項目 (appended) も返す
      return ok({ streamId, eventKey, ...result, appended: result.appendedCount > 0 })
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
