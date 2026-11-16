// src/ui/LiverBingo/editor/patterns/patternRepository.ts
import { bingoApi } from '@/manager/services/bingoApi'
import {
  LiverBingoPatternSchema,
  toLiverBingoPatternInfo,
  type LiverBingoPatternInfoType,
  type LiverBingoPatternInputType,
  type LiverBingoPatternType,
} from '@/types/ui'

/**
 * 保存パターンの保存先
 * - サーバー: server/bingo-patterns/<id>.json (サーバーに接続しているとき)
 * - このブラウザ: localStorage (サーバーに接続していないとき)
 * どちらも同じ操作で使えるようにして、画面は保存先を気にしない
 */
export type PatternRepository = {
  /** 一覧(更新日時の新しい順) */
  list: () => Promise<LiverBingoPatternInfoType[]>
  /** 1 件の中身(無ければ null) */
  load: (id: string) => Promise<LiverBingoPatternType | null>
  /** 保存(同じ id なら上書き) */
  save: (pattern: LiverBingoPatternInputType) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const createServerRepository = (): PatternRepository => ({
  list: () => bingoApi.listPatterns(),
  load: (id) => bingoApi.loadPattern(id),
  save: async (pattern) => {
    await bingoApi.savePattern(pattern)
  },
  remove: (id) => bingoApi.deletePattern(id),
})

/** localStorage の保存キー */
export const LOCAL_PATTERNS_KEY = 'omikujiBot.liverBingo.patterns'

/**
 * このブラウザ(localStorage)に、全パターンを 1 つの JSON 配列として保存する
 * 読めない・形式が違う項目は無視する(他が壊れていても、読めるものは使える)
 */
export const createLocalRepository = (
  storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage
): PatternRepository => {
  const readAll = (): LiverBingoPatternType[] => {
    try {
      const raw = JSON.parse(storage.getItem(LOCAL_PATTERNS_KEY) ?? '[]')
      if (!Array.isArray(raw)) return []
      return raw.flatMap((entry) => {
        const parsed = LiverBingoPatternSchema.safeParse(entry)
        return parsed.success ? [parsed.data] : []
      })
    } catch {
      return []
    }
  }

  // 容量オーバーなどで書けないときは、例外をそのまま画面に伝える(保存できたように見せない)
  const writeAll = (patterns: LiverBingoPatternType[]) => storage.setItem(LOCAL_PATTERNS_KEY, JSON.stringify(patterns))

  return {
    list: async () =>
      readAll()
        .map(toLiverBingoPatternInfo)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    load: async (id) => readAll().find((pattern) => pattern.id === id) ?? null,
    save: async (pattern) => {
      const others = readAll().filter((saved) => saved.id !== pattern.id)
      writeAll([...others, { ...pattern, updatedAt: Date.now() }])
    },
    remove: async (id) => writeAll(readAll().filter((pattern) => pattern.id !== id)),
  }
}
