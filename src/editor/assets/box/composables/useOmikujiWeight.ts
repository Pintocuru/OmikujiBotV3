// src/editor/assets/box/composables/useOmikujiWeight.ts
import { toRaw } from 'vue'
import { generateId } from '@/types/core'
import type { OmikujiItemType } from '@/types/OmikujiData/'

export const OMIKUJI_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#84cc16',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#a855f7',
] as const

export const getColorForIndex = (index: number): string => OMIKUJI_COLORS[index % OMIKUJI_COLORS.length]

// weight は lottery.weight にある
export function updateItemWeight(items: OmikujiItemType[], index: number, weight: number): OmikujiItemType[] {
  return items.map((item, i) => (i === index ? { ...item, lottery: { ...item.lottery, weight } } : item))
}

export function duplicateItemAt(items: OmikujiItemType[], index: number): OmikujiItemType[] {
  const src = items[index]
  if (!src) return items
  const id = generateId()
  const copy = { ...structuredClone(toRaw(src)), id, key: id, name: `${src.name}(コピー)` }
  const next = [...items]
  next.splice(index + 1, 0, copy)
  return next
}

export const removeItemAt = (items: OmikujiItemType[], index: number): OmikujiItemType[] =>
  items.filter((_, i) => i !== index)
