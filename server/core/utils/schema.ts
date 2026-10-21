// server/core/utils/schema.ts
import { z } from 'zod'

export type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string }

/**
 * zod スキーマで検証し、最初のエラーを「パス: メッセージ」の文字列にして返す
 */
export function parseWith<S extends z.ZodType>(schema: S, input: unknown): ParseResult<z.infer<S>> {
  const result = schema.safeParse(input)
  if (result.success) return { ok: true, data: result.data }

  const issue = result.error.issues[0]
  const path = issue.path.join('.')
  return { ok: false, error: path ? `${path}: ${issue.message}` : issue.message }
}
