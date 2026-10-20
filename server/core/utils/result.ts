// server/core/utils/result.ts
import { ApiResult } from '@server/types'
import { HTTP, INVALID_PATH_CODE } from '@server/core/constants'

export const ok = <T>(data: T): ApiResult<T> => ({ code: HTTP.OK, data })

export const fail = (code: number, error: string): ApiResult<{ error: string }> => ({
  code,
  data: { error },
})

export const badRequest = (error: string) => fail(HTTP.BAD_REQUEST, error)

interface GuardOptions {
  /** ENOENT のとき 404 として返すメッセージ。未指定なら 500 扱い */
  notFound?: string
}

/**
 * ハンドラー共通のエラー処理
 * - パス検証失敗 → 400
 * - ENOENT (notFound 指定時) → 404
 * - それ以外 → 500
 */
export async function guard<T>(
  label: string,
  failMessage: string,
  fn: () => Promise<ApiResult<T>>,
  options: GuardOptions = {}
): Promise<ApiResult<T | { error: string }>> {
  try {
    return await fn()
  } catch (error: any) {
    if (error?.code === INVALID_PATH_CODE) {
      return badRequest('Invalid file name')
    }
    if (options.notFound && error?.code === 'ENOENT') {
      console.info(`${label}: not found`)
      return fail(HTTP.NOT_FOUND, options.notFound)
    }
    console.error(`${label} error:`, error)
    return fail(HTTP.INTERNAL_ERROR, failMessage)
  }
}
