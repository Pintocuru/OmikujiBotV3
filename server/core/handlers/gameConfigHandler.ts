// server/core/handlers/gameConfigHandler.ts
// LiveConsole のゲームの設定 (1 ゲーム = 1 ファイル: game-configs/<gameKey>.json)
import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, badRequest, guard } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import { withLock } from '@server/core/utils/mutex'
import { DIR_NAME } from '@server/core/constants'
import { GameConfigKeySchema, LoadGameConfigResponseSchema, SaveGameConfigRequestSchema } from '@/types/api'

const toFileName = (gameKey: string) => `${gameKey}.json`

/**
 * 1 ゲームの設定を取得 (保存されていなければ 404)
 */
export async function loadGameConfig(gameKey: string | undefined): Promise<ApiResult> {
  const parsedKey = GameConfigKeySchema.safeParse(gameKey)
  if (!parsedKey.success) return badRequest('Invalid gameKey')

  return guard<unknown>(
    'Load game config',
    'Failed to load game config',
    async () =>
      ok(
        LoadGameConfigResponseSchema.parse(await fileSystem.loadFile(DIR_NAME.gameConfigs, toFileName(parsedKey.data)))
      ),
    { notFound: 'Game config not found' }
  )
}

/**
 * 設定を保存 (同じ gameKey なら上書き。updatedAt はここで付ける)
 */
export async function saveGameConfig(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(SaveGameConfigRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  const { gameKey, config } = parsed.data
  return withLock(`game-config:${gameKey}`, () =>
    guard('Save game config', 'Failed to save game config', async () => {
      const updatedAt = Date.now()
      await fileSystem.saveFile(
        DIR_NAME.gameConfigs,
        toFileName(gameKey),
        JSON.stringify({ gameKey, config, updatedAt })
      )
      console.info(`💾 Saved game config: ${gameKey}`)
      return ok({ gameKey, updatedAt })
    })
  )
}
