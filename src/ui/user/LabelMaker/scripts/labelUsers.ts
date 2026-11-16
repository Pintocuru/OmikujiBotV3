// src/ui/user/LabelMaker/scripts/labelUsers.ts
// ラベルに載せるユーザーを作る (純粋関数)
import type { UserNameType } from '@/types/OmikenComment'
import type { LabelMakerTarget } from '@/types/ui'

/** 1 回の投稿ぶん。key は、同じユーザーが何度も載っても表示を区別するため(投稿メッセージの id) */
export type LabelEntry = { key: string; user: UserNameType }

/**
 * 届いた順の投稿から、表示するものを新しい順に作る
 * - target が user のときは、同じ userId を 1 回だけ載せる(最後に届いた位置)
 * - userId が空のユーザーは、同一人物か分からないので、重複排除せずそのまま載せる
 */
export function buildLabelUsers(entries: LabelEntry[], target: LabelMakerTarget, limit: number): LabelEntry[] {
  if (limit <= 0) return []

  const result: LabelEntry[] = []
  const seen = new Set<string>()

  for (let i = entries.length - 1; i >= 0 && result.length < limit; i--) {
    const entry = entries[i]
    const { userId } = entry.user
    if (target === 'user' && userId !== '') {
      if (seen.has(userId)) continue
      seen.add(userId)
    }
    result.push(entry)
  }
  return result
}

/** エディターのプレビュー用 (同じユーザーを混ぜて、user / draw の違いが見えるようにする) */
export function buildPreviewUsers(): LabelEntry[] {
  const names = ['ひなた', 'さくら', 'あおい', 'ひなた', 'ゆうと', 'さくら', 'みお', 'そうた']
  return names.map((userName, index) => ({
    key: `preview-${index}`,
    user: { userName, userId: `preview-${userName}`, profileImage: '', timestamp: index },
  }))
}
