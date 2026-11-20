// server/core/handlers/bingoPatternHandler.ts
// ライバービンゴの保存パターン (1 パターン = 1 ファイル: bingo-patterns/<id>.json)
import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, badRequest, guard } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import { withLock } from '@server/core/utils/mutex'
import { DIR_NAME } from '@server/core/constants'
import {
  LiverBingoPatternIdSchema,
  LiverBingoPatternSchema,
  toLiverBingoPatternInfo,
  type LiverBingoPatternInfoType,
} from '@/types/ui'
import { SaveBingoPatternRequestSchema } from '@/types/api'

const toFileName = (id: string) => `${id}.json`

/**
 * 保存済みのパターン一覧 (更新日時の新しい順)
 * 一覧に名前などを出すため、各ファイルを読む。読めない・形式が違うファイルは一覧に出さない
 */
export async function listBingoPatterns(): Promise<ApiResult> {
  return guard('List bingo patterns', 'Failed to list bingo patterns', async () => {
    const files = await fileSystem.getFileList(DIR_NAME.bingoPatterns, { withMeta: false, recursive: false })

    const items: LiverBingoPatternInfoType[] = []
    for (const file of files) {
      if (file.name.includes('/') || !file.name.endsWith('.json')) continue
      if (!LiverBingoPatternIdSchema.safeParse(file.name.replace(/\.json$/, '')).success) continue
      try {
        const pattern = LiverBingoPatternSchema.parse(await fileSystem.loadFile(DIR_NAME.bingoPatterns, file.name))
        items.push(toLiverBingoPatternInfo(pattern))
      } catch (error) {
        console.warn(`Skipped invalid bingo pattern: ${file.name}`, error)
      }
    }

    return ok(items.sort((a, b) => b.updatedAt - a.updatedAt))
  })
}

/**
 * 1 パターンを取得
 */
export async function loadBingoPattern(id: string | undefined): Promise<ApiResult> {
  const parsedId = LiverBingoPatternIdSchema.safeParse(id)
  if (!parsedId.success) return badRequest('Invalid id')

  return guard<unknown>(
    'Load bingo pattern',
    'Failed to load bingo pattern',
    async () =>
      ok(LiverBingoPatternSchema.parse(await fileSystem.loadFile(DIR_NAME.bingoPatterns, toFileName(parsedId.data)))),
    { notFound: 'Bingo pattern not found' }
  )
}

/**
 * パターンを保存 (同じ id なら上書き。updatedAt はここで付ける)
 */
export async function saveBingoPattern(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(SaveBingoPatternRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  const { pattern } = parsed.data
  return withLock(`bingo-pattern:${pattern.id}`, () =>
    guard('Save bingo pattern', 'Failed to save bingo pattern', async () => {
      const updatedAt = Date.now()
      await fileSystem.saveFile(
        DIR_NAME.bingoPatterns,
        toFileName(pattern.id),
        JSON.stringify({ ...pattern, updatedAt })
      )
      console.info(`💾 Saved bingo pattern: ${pattern.id}`)
      return ok({ id: pattern.id, updatedAt })
    })
  )
}

/**
 * パターンを削除
 */
export async function deleteBingoPattern(id: string | undefined): Promise<ApiResult> {
  const parsedId = LiverBingoPatternIdSchema.safeParse(id)
  if (!parsedId.success) return badRequest('Invalid id')

  return withLock(`bingo-pattern:${parsedId.data}`, () =>
    guard(
      'Delete bingo pattern',
      'Failed to delete bingo pattern',
      async () => {
        await fileSystem.deleteFile(DIR_NAME.bingoPatterns, toFileName(parsedId.data))
        console.info(`🗑️ Deleted bingo pattern: ${parsedId.data}`)
        return ok({ message: 'Bingo pattern deleted successfully' })
      },
      { notFound: 'Bingo pattern not found' }
    )
  )
}
