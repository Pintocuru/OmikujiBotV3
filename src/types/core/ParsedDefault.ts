// src/types/core/ParsedDefault.ts
import { z } from 'zod'
import { markParseIssues, recordParseIssue, rollbackParseIssues, withParsePath } from './ParseIssues'

const reasonOf = (error: z.ZodError): string =>
  error.issues.map((i) => (i.path.length ? `${i.path.join('.')}: ` : '') + i.message).join(' / ')

const isPlainObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v)

/**
 * Array: 要素単位で検証し、不正な要素だけ除外する (除外は issues に記録)
 * category は issues の分類名 (例: 'events.comments')
 */
export function normalizedArray<T extends z.ZodType>(itemSchema: T, category = 'array') {
  return z
    .unknown()
    .transform((raw): z.output<T>[] => {
      if (!Array.isArray(raw)) {
        recordParseIssue({ category, key: '', action: 'dropped', reason: '配列ではありません', raw })
        return []
      }
      const out: z.output<T>[] = []
      raw.forEach((element, index) => {
        const mark = markParseIssues()
        const result = withParsePath(index, () => itemSchema.safeParse(element))
        if (result.success) {
          out.push(result.data)
          return
        }
        rollbackParseIssues(mark) // 除外する要素の内側の issues は不要
        recordParseIssue({ category, key: index, action: 'dropped', reason: reasonOf(result.error), raw: element })
      })
      return out
    })
    .default(() => [])
}

/**
 * Record: 要素単位で検証し、不正な要素だけ除外する (除外は issues に記録)
 */
export function normalizedRecord<T extends z.ZodType>(itemSchema: T, category = 'record') {
  return z
    .unknown()
    .transform((raw): Record<string, z.output<T>> => {
      if (!isPlainObject(raw)) {
        recordParseIssue({ category, key: '', action: 'dropped', reason: 'object ではありません', raw })
        return {}
      }
      const entries: [string, z.output<T>][] = []
      for (const [key, value] of Object.entries(raw)) {
        const mark = markParseIssues()
        const result = withParsePath(key, () => itemSchema.safeParse(value))
        if (result.success) {
          entries.push([key, result.data])
          continue
        }
        rollbackParseIssues(mark)
        recordParseIssue({ category, key, action: 'dropped', reason: reasonOf(result.error), raw: value })
      }
      return Object.fromEntries(entries)
    })
    .default(() => ({}))
}

/**
 * Object: 不正なフィールドだけ既定値に戻す (object 全体は既定値にしない)
 * - フィールド単位に戻せない schema (union など) や、戻しても通らない場合だけ object 全体を既定値にする
 * - どちらも issues に記録する
 */
export function normalizedObject<T extends z.ZodType>(schema: T, category = 'object') {
  const make = () => schema.parse({}) as z.output<T>
  make() // デフォルト不足があれば、起動時に原因が分かるエラーにする

  return z
    .unknown()
    .transform((raw): z.output<T> => {
      const mark = markParseIssues()
      const whole = schema.safeParse(raw)
      if (whole.success) return whole.data
      rollbackParseIssues(mark)

      // 不正なフィールドだけ既定値に差し替えて、もう一度 parse する
      if (schema instanceof z.ZodObject && isPlainObject(raw)) {
        const shape = schema.shape as Record<string, z.ZodType>
        const defaults = make() as Record<string, unknown>
        const candidate: Record<string, unknown> = { ...raw }
        const failed: { key: string; reason: string; raw: unknown }[] = []
        for (const key of Object.keys(shape)) {
          const fieldMark = markParseIssues()
          const field = shape[key].safeParse(raw[key])
          rollbackParseIssues(fieldMark)
          if (field.success) continue
          failed.push({ key, reason: reasonOf(field.error), raw: raw[key] })
          candidate[key] = defaults[key]
        }
        if (failed.length > 0) {
          const retry = schema.safeParse(candidate)
          if (retry.success) {
            for (const f of failed) recordParseIssue({ category, key: f.key, action: 'defaulted', reason: f.reason, raw: f.raw })
            return retry.data
          }
          rollbackParseIssues(mark)
        }
      }

      recordParseIssue({ category, key: '', action: 'defaulted', reason: reasonOf(whole.error), raw })
      return make()
    })
    .default(make as never)
}
