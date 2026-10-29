// src/common/MockUser/MockUserPool.ts
import { UserStatsRecord } from '@/types/api'
import { LocaleType } from '@/types/OmikujiData/'
import { generateDummyUserStats } from './MockGenerators'

/**
 * 「想定ユーザー数」でテストするためのユーザープール
 * - 最初に N 人ぶんの UserStatsRecord を作り、コメントのたびにその中から投稿者を選ぶ
 * - 同じ userId が繰り返し現れるので「n回目の人」を条件にした判定のテストができる
 */

// generateDummyUserStats 側の上限(300)に合わせる
export const MOCK_USER_POOL_MAX = 300

// 画面から選ぶ人数のプリセット
export const MOCK_USER_POOL_PRESETS = [10, 50, 100] as const

export type MockUserPickMode =
  | 'even' // 全員が同じ確率で投稿する
  | 'regular' // 一部の常連がよく投稿する(先頭の人ほど投稿しやすい)

export const MOCK_USER_PICK_MODE_LABELS: Record<MockUserPickMode, string> = {
  even: '均等',
  regular: '常連あり',
}

export type MockUserPool = {
  readonly users: readonly UserStatsRecord[]
  pick(mode?: MockUserPickMode): UserStatsRecord
}

// 常連あり: 重み 1 / (順位 + 1)^0.8 の累積から選ぶ
const REGULAR_EXPONENT = 0.8

export function createMockUserPool(size: number, locale: LocaleType = 'ja'): MockUserPool {
  const safeSize = Math.min(MOCK_USER_POOL_MAX, Math.max(1, Math.floor(size) || 1))
  const users = generateDummyUserStats(safeSize, locale)

  // 常連あり用の累積重み
  const cumulative: number[] = []
  let total = 0
  users.forEach((_, i) => {
    total += 1 / Math.pow(i + 1, REGULAR_EXPONENT)
    cumulative.push(total)
  })

  return {
    users,
    pick(mode = 'even') {
      if (mode === 'even') return users[Math.floor(Math.random() * users.length)]
      const r = Math.random() * total
      const index = cumulative.findIndex((c) => r <= c)
      return users[index === -1 ? users.length - 1 : index]
    },
  }
}
