// server/core/handlers/gameStateHandler.ts
import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, badRequest, fail, guard } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import { withLock } from '@server/core/utils/mutex'
import { DIR_NAME, HTTP } from '@server/core/constants'
import {
  GameStateSaveRequestSchema,
  StreamGameFileSchema,
  StreamGameFileType,
  StreamIdSchema,
  GameStateListItemType,
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
 * ゲームステートを保存 (state.eventKey の枠を丸ごと上書き。他の eventKey はそのまま残す)
 */
export async function saveGameState(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(GameStateSaveRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  const { streamId, state } = parsed.data

  return withLock(`game-state:${streamId}`, () =>
    guard('Save game state', 'Failed to save game state', async () => {
      const fileName = toFileName(streamId)
      const now = Date.now()

      // 既存ファイルがあれば引き継ぐ。読めない場合は上書きせずエラーにする
      let current: StreamGameFileType | null = null
      try {
        current = StreamGameFileSchema.parse(await fileSystem.loadFile(DIR_NAME.streams, fileName))
      } catch (error: any) {
        if (error?.code !== 'ENOENT') throw error
      }

      const next: StreamGameFileType = {
        streamId,
        createdAt: current?.createdAt ?? now,
        updatedAt: now,
        states: { ...current?.states, [state.eventKey]: state },
      }

      await fileSystem.saveFile(DIR_NAME.streams, fileName, JSON.stringify(next))
      console.info(`💾 Saved game state: ${fileName} (eventKey: ${state.eventKey || '-'})`)
      return ok({ streamId, eventKey: state.eventKey, updatedAt: now })
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
