// src/types/core/ParseIssues.ts
// parse 時に「除外した要素」「既定値に戻したフィールド」を記録するコレクタ。
// Zod 4 の parse には任意のコンテキストを渡せないため、同期 parse の間だけ有効なモジュール変数で受ける。
// (スキーマに async な検証は無いので、collectParseIssues の中で完結する)

export type ParseIssueAction = 'dropped' | 'defaulted'

export interface ParseIssue {
  /** 対象の集合・オブジェクト (例: 'assets.mikuji.items') */
  category: string
  /** dropped: 除外した要素の key(record) / index(array)。defaulted: 既定値に戻したフィールド名('' は object 全体) */
  key: string | number
  /** 祖先の array / record の key・index (外側 → 内側)。例: みくじ箱 key */
  path: (string | number)[]
  action: ParseIssueAction
  /** 理由 (Zod の issue を連結したもの) */
  reason: string
  /** 除外した(または置き換えた)生データ */
  raw: unknown
}

let current: ParseIssue[] | null = null
let pathStack: (string | number)[] = []

/** run の間に発生した issues を集めて { data, issues } で返す */
export function collectParseIssues<T>(run: () => T): { data: T; issues: ParseIssue[] } {
  const prevCurrent = current
  const prevPath = pathStack
  const issues: ParseIssue[] = []
  current = issues
  pathStack = []
  try {
    return { data: run(), issues }
  } finally {
    current = prevCurrent
    pathStack = prevPath
  }
}

/** issue を記録する。コレクタ外で呼ばれた場合は握りつぶさず console.warn する */
export function recordParseIssue(issue: Omit<ParseIssue, 'path'>): void {
  if (!current) {
    console.warn(`[ParseIssue] ${issue.category} [${issue.key}] ${issue.action}: ${issue.reason}`)
    return
  }
  current.push({ ...issue, path: [...pathStack] })
}

/** 要素を検証している間、祖先の key/index を積む */
export function withParsePath<T>(key: string | number, run: () => T): T {
  pathStack.push(key)
  try {
    return run()
  } finally {
    pathStack.pop()
  }
}

/** 試し parse の前後で、記録した issues を巻き戻すための目印 */
export const markParseIssues = (): number => current?.length ?? 0
export const rollbackParseIssues = (mark: number): void => {
  if (current) current.length = mark
}

/** カテゴリ別の件数 */
export function summarizeParseIssues(issues: readonly ParseIssue[]): { total: number; byCategory: Record<string, number> } {
  const byCategory: Record<string, number> = {}
  for (const issue of issues) byCategory[issue.category] = (byCategory[issue.category] ?? 0) + 1
  return { total: issues.length, byCategory }
}

/**
 * 1行サマリ
 * 例: 「3件除外(assets.mikuji.items: 2 / events.comments: 1)」「1件除外(...) / 2件を既定値に戻した(...)」
 */
export function formatParseIssuesSummary(issues: readonly ParseIssue[]): string {
  const part = (action: ParseIssueAction, label: string): string | null => {
    const { total, byCategory } = summarizeParseIssues(issues.filter((i) => i.action === action))
    if (total === 0) return null
    const breakdown = Object.entries(byCategory)
      .map(([category, count]) => `${category}: ${count}`)
      .join(' / ')
    return `${total}件${label}(${breakdown})`
  }
  return [part('dropped', '除外'), part('defaulted', 'を既定値に戻した')].filter(Boolean).join(' / ')
}
