import { describe, expect, it } from 'vitest'
import { buildImageCandidates } from './imageCandidates'

const files = ['chocolate/default.webp', 'chocolate/face.webp', 'common/logo.png', 'vanilla/default.webp'] // サーバは昇順で返す
const base = { files, characterKey: 'chocolate', characterPaths: [], usedPaths: [] }

describe('buildImageCandidates', () => {
  it('既定は「キャラID/ 以下」だけを出す', () => {
    const { groups, othersCount } = buildImageCandidates(base)
    expect(groups.map((g) => g.key)).toEqual(['characterFolder'])
    expect(groups[0].candidates.map((c) => c.path)).toEqual(['chocolate/default.webp', 'chocolate/face.webp'])
    expect(othersCount).toBe(2)
  })

  it('他の感情で使っているパスは1番目のグループで、同じパスは1回だけ出す', () => {
    const { groups } = buildImageCandidates({ ...base, characterPaths: ['chocolate/face.webp', 'x/unlisted.webp'] })
    expect(groups.map((g) => g.key)).toEqual(['sameCharacter', 'characterFolder'])
    expect(groups[0].candidates.map((c) => c.path)).toEqual(['chocolate/face.webp', 'x/unlisted.webp'])
    expect(groups[1].candidates.map((c) => c.path)).toEqual(['chocolate/default.webp'])
  })

  it('includeOthers で3番目のグループを出す', () => {
    const { groups } = buildImageCandidates({ ...base, includeOthers: true })
    expect(groups.map((g) => g.key)).toEqual(['characterFolder', 'others'])
    expect(groups[1].candidates.map((c) => c.path)).toEqual(['common/logo.png', 'vanilla/default.webp'])
  })

  it('この感情の他のレイヤーで使用中のものは used になる', () => {
    const { groups } = buildImageCandidates({ ...base, usedPaths: ['chocolate/default.webp'] })
    expect(groups[0].candidates.map((c) => [c.path, c.used])).toEqual([
      ['chocolate/default.webp', true],
      ['chocolate/face.webp', false],
    ])
  })

  it('検索は大文字小文字を区別せず、空のグループは出さない', () => {
    const { groups } = buildImageCandidates({ ...base, query: 'FACE' })
    expect(groups).toHaveLength(1)
    expect(groups[0].candidates.map((c) => c.path)).toEqual(['chocolate/face.webp'])
  })

  it('一覧が空でも、他の感情のパスは出る', () => {
    const { groups } = buildImageCandidates({ ...base, files: [], characterPaths: ['chocolate/face.webp'] })
    expect(groups.map((g) => g.key)).toEqual(['sameCharacter'])
  })
})
