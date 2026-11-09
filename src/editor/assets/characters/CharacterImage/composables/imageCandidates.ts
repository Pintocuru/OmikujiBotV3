// src/editor/assets/characters/CharacterImage/composables/imageCandidates.ts

export type ImageCandidateGroupKey = 'sameCharacter' | 'characterFolder' | 'others'

export type ImageCandidate = {
  path: string
  /** この感情の他のレイヤーで使用中 */
  used: boolean
}

export type ImageCandidateGroup = {
  key: ImageCandidateGroupKey
  candidates: ImageCandidate[]
}

type BuildOptions = {
  /** サーバの画像一覧 */
  files: readonly string[]
  characterKey: string
  /** このキャラクターの他の感情で使っているパス */
  characterPaths: readonly string[]
  /** この感情の他のレイヤーで使っているパス */
  usedPaths: readonly string[]
  query?: string
  /** 他のキャラ・他のフォルダの画像 (3番目のグループ) を含めるか */
  includeOthers?: boolean
}

/**
 * 候補の一覧をグループ分けして作る。同じパスは最初に当てはまるグループに1回だけ出す
 *  1. このキャラクターの他の感情で使っているパス
 *  2. `キャラID/` 以下の画像
 *  3. その他 (他のキャラ・他のフォルダ)。includeOthers のときだけ
 * othersCount は絞り込み後の3番目のグループの件数 (切り替えボタンの表示用)
 */
export function buildImageCandidates({
  files,
  characterKey,
  characterPaths,
  usedPaths,
  query = '',
  includeOthers = false,
}: BuildOptions): { groups: ImageCandidateGroup[]; othersCount: number } {
  const used = new Set(usedPaths)
  const keyword = query.trim().toLowerCase()
  const matches = (path: string) => !keyword || path.toLowerCase().includes(keyword)
  const seen = new Set<string>()

  const take = (paths: readonly string[]): ImageCandidate[] => {
    const result: ImageCandidate[] = []
    for (const path of paths) {
      if (!path.trim() || seen.has(path)) continue
      seen.add(path)
      if (matches(path)) result.push({ path, used: used.has(path) })
    }
    return result
  }

  const folderPrefix = `${characterKey}/`
  const sameCharacter = take(characterPaths)
  const characterFolder = take(files.filter((file) => file.startsWith(folderPrefix)))
  const others = take(files)

  const groups: ImageCandidateGroup[] = [
    { key: 'sameCharacter', candidates: sameCharacter },
    { key: 'characterFolder', candidates: characterFolder },
    ...(includeOthers ? [{ key: 'others' as const, candidates: others }] : []),
  ]
  return { groups: groups.filter((group) => group.candidates.length > 0), othersCount: others.length }
}
