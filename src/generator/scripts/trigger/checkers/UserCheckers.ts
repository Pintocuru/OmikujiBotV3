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
 * ユーザー名パターンチェック
 */
export function checkUsername(name: string, patterns: string[] = []): boolean {
  if (!patterns.length) return true
  if (!name) return false

  return patterns.some((pattern) => {
    try {
      return new RegExp(pattern).test(name)
    } catch (e) {
      console.warn(`Invalid username regex pattern: ${pattern}`, e)
      return false
    }
  })
}
