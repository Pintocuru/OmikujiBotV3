// src/generator/scripts/trigger/checkers/UserCheckers.ts

/**
 * ユーザーID条件チェック（許可/禁止リスト対応）
 */
export function checkUserIdCondition(userId: string, userIds: string[] = []): boolean {
  if (!userIds.length) return true
  if (!userId) return false

  const allowedIds = userIds.filter((id) => !id.startsWith('!'))
  const disallowedIds = userIds.filter((id) => id.startsWith('!')).map((id) => id.substring(1))

  // 禁止リストチェック
  if (disallowedIds.includes(userId)) return false

  // 許可リストが空またはユーザーが含まれている
  return !allowedIds.length || allowedIds.includes(userId)
}

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

  const matches = (pattern: string): boolean => {
    try {
      return new RegExp(pattern).test(name)
    } catch (e) {
      console.warn(`Invalid username regex pattern: ${pattern}`, e)
      return false
    }
  }

  const allowed = valid.filter((p) => !p.startsWith('!'))
  const disallowed = valid.filter((p) => p.startsWith('!')).map((p) => p.substring(1))

  // 除外リストチェック
  if (disallowed.some(matches)) return false

  // 許可リストが空、またはいずれかにマッチ
  return !allowed.length || allowed.some(matches)
}
