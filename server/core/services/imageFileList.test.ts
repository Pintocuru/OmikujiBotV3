import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getImageFileList, listImageRootDirs } from './fileSystemService'

let tmp: string
const touch = (...parts: string[]) => {
  const file = path.join(tmp, ...parts)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, '')
}

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'images-'))
})
afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true })
})

describe('listImageRootDirs', () => {
  it('common / wip / YYYY-Qn だけを画像ルートにする', () => {
    for (const name of ['common', 'wip', '2026-Q2', 'other', '2026-Q', 'x']) fs.mkdirSync(path.join(tmp, name))
    touch('file.txt')
    expect(listImageRootDirs(tmp).map((p) => path.basename(p))).toEqual(['2026-Q2', 'common', 'wip'])
  })

  it('フォルダが無ければ空配列', () => {
    expect(listImageRootDirs(path.join(tmp, 'none'))).toEqual([])
  })
})

describe('getImageFileList', () => {
  it('複数ルートの中身を相対パスでまとめ、重複を1回にする', async () => {
    touch('common', 'chocolate', 'default.webp')
    touch('wip', 'chocolate', 'default.webp')
    touch('wip', 'chocolate', 'face.PNG')
    touch('wip', 'chocolate', 'memo.txt')
    const list = await getImageFileList([path.join(tmp, 'common'), path.join(tmp, 'wip')])
    expect(list).toEqual(['chocolate/default.webp', 'chocolate/face.PNG'])
  })

  it('存在しないルートは無視する', async () => {
    expect(await getImageFileList([path.join(tmp, 'none')])).toEqual([])
    expect(await getImageFileList([])).toEqual([])
  })
})
