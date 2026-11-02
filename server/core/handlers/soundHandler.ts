// server/core/handlers/soundHandler.ts
import { ApiResult, RequestContext } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, guard } from '@server/core/utils/result'

/**
 * sounds フォルダの音声ファイル一覧を取得 (sounds からの相対パス)
 */
export async function listSounds(ctx: RequestContext): Promise<ApiResult> {
  return guard('List sounds', 'Failed to list sounds', async () => {
    const files = await fileSystem.getSoundFileList(ctx.soundsDir)
    return ok(files)
  })
}
