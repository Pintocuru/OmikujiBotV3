// server/core/handlers/omikujiHandler.ts
import { ApiResult, RequestContext } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { ok, badRequest, guard } from '@server/core/utils/result'

/**
 * おみくじデータを保存
 * 保存先は呼び出し元(ctx)が決める。応答の filePath は実際に書き込んだ場所を返す。
 */
export async function saveOmikujiData(configData: string, ctx: RequestContext): Promise<ApiResult> {
  if (!configData) return badRequest('configData is required')

  return guard('Save omikuji', 'Failed to save omikuji data', async () => {
    const filePath = await fileSystem.saveOmikujiData(configData, ctx.omikujiOutputDir)
    console.info(`🎋 Saved omikuji data to ${filePath}`)
    return ok({ message: 'Omikuji data saved successfully', filePath })
  })
}
