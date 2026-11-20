// server/core/apiConsistency.test.ts
// move の上書き防止 / 一覧の読み取り / since の検証 / health の apiVersion の確認
// ※ ファイルを触るテストは、OS の一時フォルダだけを使う (server 配下のデータは触らない)
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { routeRequest } from './router'
import { parseSince } from './utils/validation'
import { getFileList, moveFile, saveFile, loadFile } from './services/fileSystemService'
import { API_VERSION } from '@server/api/actions'
import { SERVER_ROOT } from '@server/constants'
import type { RequestContext } from '@server/types'

const ctx: RequestContext = { omikujiOutputDir: '/nonexistent' }
const get = (action: string, params: Record<string, string> = {}) =>
  routeRequest({ method: 'GET', action, params, body: {} }, ctx)

describe('health', () => {
  it('apiVersion と appVersion を返す', async () => {
    const result = await get('health')
    expect(result.code).toBe(200)
    expect(result.data.apiVersion).toBe(API_VERSION)
    expect(typeof result.data.appVersion).toBe('string')
  })
})

describe('parseSince', () => {
  it('未指定・空文字は undefined、0 以上の整数はその値、それ以外は不正', () => {
    expect(parseSince(undefined)).toEqual({ ok: true, value: undefined })
    expect(parseSince('  ')).toEqual({ ok: true, value: undefined })
    expect(parseSince('0')).toEqual({ ok: true, value: 0 })
    expect(parseSince('123')).toEqual({ ok: true, value: 123 })
    for (const bad of ['abc', '-1', '1.5', 'NaN', 'Infinity']) {
      expect(parseSince(bad)).toEqual({ ok: false })
    }
  })

  it.each(['load-pad-status', 'load-bingo-commands', 'load-user-stats'])(
    '%s は不正な since を 400 にする',
    async (action) => {
      expect((await get(action, { since: 'abc' })).code).toBe(400)
    }
  )

  it.each(['load-pad-status', 'load-bingo-commands'])('%s は since なし・空文字を受け付ける', async (action) => {
    expect((await get(action)).code).toBe(200)
    expect((await get(action, { since: '' })).code).toBe(200)
  })
})

describe('fileSystemService (一時フォルダ)', () => {
  let tmp: string
  let rootName: string

  beforeAll(async () => {
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'omikuji-core-'))
    rootName = path.relative(SERVER_ROOT, tmp)
  })
  afterAll(async () => {
    await fs.rm(tmp, { recursive: true, force: true })
  })

  it('移動先に同名のファイルがあれば EEXIST で、どちらのファイルも変わらない', async () => {
    await saveFile(rootName, 'a.json', '{"v":"a"}')
    await saveFile(rootName, 'folder/a.json', '{"v":"dest"}')

    await expect(moveFile(rootName, 'a.json', 'folder/a.json')).rejects.toMatchObject({ code: 'EEXIST' })
    expect(await loadFile(rootName, 'a.json')).toEqual({ v: 'a' })
    expect(await loadFile(rootName, 'folder/a.json')).toEqual({ v: 'dest' })
  })

  it('移動先がなければ移動できる。移動元がなければ ENOENT', async () => {
    await moveFile(rootName, 'a.json', 'other/b.json')
    expect(await loadFile(rootName, 'other/b.json')).toEqual({ v: 'a' })
    await expect(moveFile(rootName, 'missing.json', 'x.json')).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('getFileList は recursive: false でサブフォルダを含めない', async () => {
    await saveFile(rootName, 'top.json', '{}')
    const flat = await getFileList(rootName, { withMeta: false, recursive: false })
    expect(flat.map((f) => f.name)).toEqual(['top.json'])

    const all = await getFileList(rootName, { withMeta: false })
    expect(all.map((f) => f.name).sort()).toEqual(['folder/a.json', 'other/b.json', 'top.json'])
  })

  it('getFileList は読めないフォルダのとき、空の一覧ではなく例外を投げる', async () => {
    const filePath = path.join(tmp, 'not-a-dir')
    await fs.writeFile(filePath, 'x')
    await expect(getFileList(path.relative(SERVER_ROOT, filePath))).rejects.toBeDefined()
  })
})
