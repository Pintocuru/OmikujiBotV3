// src/types/OmikujiData/ParsedDefault.ts
import { z } from 'zod'

// Zod schema に default({}) + catch({}) を付けるヘルパー
export function normalizedObject<T extends z.ZodType>(schema: T): z.ZodCatch<z.ZodDefault<T>> {
  const make = () => schema.parse({}) as z.output<T>
  make() // デフォルト不足があれば、起動時に原因が分かるエラーにする
  return (schema as any).default(make).catch(make)
}

// Record
export function normalizedRecord<T extends z.ZodType>(itemSchema: T) {
  return z.record(z.string(), itemSchema).default({}).catch({})
}

// Array
export function normalizedArray<T extends z.ZodType>(itemSchema: T) {
  return z.array(itemSchema).default([]).catch([])
}
