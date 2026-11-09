// server/core/handlers/imageHandler.ts
import { ApiResult, RequestContext } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, guard } from '@server/core/utils/result'

/**
 * 画像ルート配下の画像・動画ファイル一覧を取得 (各ルートからの相対パス。images フォルダが無ければ空配列)
 */
export async function listImages(ctx: RequestContext): Promise<ApiResult> {
  return guard('List images', 'Failed to list images', async () => {
    const files = await fileSystem.getImageFileList(ctx.imagesDirs)
    return ok(files)
  })
}
