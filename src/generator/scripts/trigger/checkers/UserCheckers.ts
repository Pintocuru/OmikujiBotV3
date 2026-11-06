// src/generator/scripts/trigger/checkers/UserCheckers.ts
import { compilePattern } from './compilePattern'

/**
 * ユーザー名パターンチェック (正規表現・許可/禁止リスト対応)
 * - 先頭が「!」のパターンは除外指定。マッチしたら false
 * - 除外以外のパターンが1つでもあれば、いずれかにマッチしたときだけ true
 * - 空行は無視。有効なパターンがなければ true
 */
export function checkUsername(name: string, patterns: string[] = []): boolean {
  const valid = patterns.filter((p) => p.trim() !== '')
  if (!valid.length) return true
  if (!name) return false

  // 不正な正規表現のとき whenInvalid を返す
  const matches = (pattern: string, whenInvalid: boolean): boolean => {
    const regex = compilePattern(pattern)
    return regex ? regex.test(name) : whenInvalid
  }

  const allowed = valid.filter((p) => !p.startsWith('!'))
  const disallowed = valid.filter((p) => p.startsWith('!')).map((p) => p.substring(1))

  // 除外リストチェック(不正な除外パターンは、安全側に倒して「除外する」)
  if (disallowed.some((p) => matches(p, true))) return false

  // 許可リストが空、またはいずれかにマッチ
  return !allowed.length || allowed.some((p) => matches(p, false))
}
