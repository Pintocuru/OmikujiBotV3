// server/core/apiHardening.test.ts
// 不正な入力が 500 ではなく 400 になること / 壊れた JSON を保存しないことの確認
// ※ 書き込みが起きない入力だけを使う (server 配下のファイルを触らない)
import { describe, expect, it } from 'vitest'
import { routeRequest } from './router'
import { isValidJson } from './utils/validation'
import { pluginRequest } from '../adapters/pluginAdapter'
import type { RequestContext } from '@server/types'

const ctx: RequestContext = { omikujiOutputDir: '/nonexistent' }

describe('isValidJson', () => {
  it('JSON として読める文字列だけ true', () => {
    expect(isValidJson('{"a":1}')).toBe(true)
    expect(isValidJson('{"a":')).toBe(false)
    expect(isValidJson('')).toBe(false)
  })
})

describe('routeRequest', () => {
  it.each([null, [], 'text', 1])('POST の body がオブジェクトでなければ 400 (%j)', async (body) => {
    const result = await routeRequest({ method: 'POST', action: 'save', params: {}, body: body as any }, ctx)
    expect(result.code).toBe(400)
  })

  it('save は JSON でない data を 400 にする', async () => {
    const result = await routeRequest(
      { method: 'POST', action: 'save', params: {}, body: { fileName: 'a.json', data: '{broken' } },
      ctx
    )
    expect(result.code).toBe(400)
  })

  it('save-generator は JSON でない data を 400 にする', async () => {
    const result = await routeRequest(
      { method: 'POST', action: 'save-generator', params: {}, body: { data: '{broken' } },
      ctx
    )
    expect(result.code).toBe(400)
  })

  it('save-omikuji は JSON でない configData を 400 にする', async () => {
    const result = await routeRequest(
      { method: 'POST', action: 'save-omikuji', params: {}, body: { configData: 'alert(1)' } },
      ctx
    )
    expect(result.code).toBe(400)
  })
})

describe('pluginRequest', () => {
  const call = (body: unknown) => pluginRequest({ method: 'POST', params: { action: 'save' }, body } as any)

  it('壊れた JSON の body は 400', async () => {
    expect((await call('{broken')).code).toBe(400)
  })

  it('"null" の body は 400', async () => {
    expect((await call('null')).code).toBe(400)
  })

  it('空文字の body は {} として扱われ、ハンドラーの 400 (必須項目なし) になる', async () => {
    const res = await call('')
    expect(res.code).toBe(400)
    expect(JSON.parse(res.response).error).toBe('fileName and data are required')
  })
})
