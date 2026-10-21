// src/generator/scripts/trigger/checkers/ContentCheckers.ts

/**
 * コメント文字列パターンチェック
 */
export function checkComment(comment: string, patterns: string[] = []): boolean {
  if (!comment) return false

  const normalize = (s: string) =>
    s
      .normalize('NFKC') // Unicode正規化
      .replace(/\u3000/g, ' ') // 全角スペース → 半角
      .replace(/\s+/g, ' ') // 連続空白圧縮
      .trim()

  const normalizedComment = normalize(comment)

  const validPatterns = patterns.map((p) => normalize(p)).filter(Boolean)

  if (validPatterns.length === 0) return false

  for (const pattern of validPatterns) {
    try {
      const regex = new RegExp(pattern, 'i')
      if (regex.test(normalizedComment)) {
        return true
      }
    } catch (e) {
      console.warn(`Invalid regex pattern: ${pattern}`, e)
    }
  }

  return false
}
