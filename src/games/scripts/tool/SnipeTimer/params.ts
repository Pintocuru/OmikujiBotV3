// src/games/scripts/tool/SnipeTimer/params.ts
import {
  SNIPE_MAX_SECONDS_LIMIT,
  SNIPE_SECOND_ADJUSTS,
  type SnipeSecondAdjust,
  type SnipeTimeLimits,
} from '@/common/SnipeTimer/parseSnipeTime'

export const DEFAULT_LIMITS: SnipeTimeLimits = { minSeconds: 10, maxSeconds: 300, secondAdjust: 10 }

const toInt = (value: string | undefined): number | undefined => {
  if (value === undefined || value.trim() === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? Math.floor(n) : undefined
}

/** queryString(min / max / adjust、すべて省略可)から、時刻の制限を決める。不正値は既定値 */
export const resolveLimits = (params: Record<string, string>): SnipeTimeLimits => {
  const min = toInt(params.min)
  const max = toInt(params.max)
  const adjust = toInt(params.adjust)

  const minSeconds = min !== undefined && min >= 1 ? min : DEFAULT_LIMITS.minSeconds
  const maxCandidate = max !== undefined && max >= 1 ? max : DEFAULT_LIMITS.maxSeconds
  return {
    minSeconds,
    maxSeconds: Math.min(Math.max(maxCandidate, minSeconds), SNIPE_MAX_SECONDS_LIMIT),
    secondAdjust: (SNIPE_SECOND_ADJUSTS as readonly number[]).includes(adjust ?? NaN)
      ? (adjust as SnipeSecondAdjust)
      : DEFAULT_LIMITS.secondAdjust,
  }
}
