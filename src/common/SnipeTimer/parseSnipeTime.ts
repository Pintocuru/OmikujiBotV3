// src/common/SnipeTimer/parseSnipeTime.ts
// スナイプタイマーの時刻パース(NextTimer の TimerAbsolute を、状態を持たない関数に移したもの)

/** 秒数を丸める単位 */
export const SNIPE_SECOND_ADJUSTS = [10, 15, 20, 30] as const
export type SnipeSecondAdjust = (typeof SNIPE_SECOND_ADJUSTS)[number]

/** 目標時刻までの最大秒数の上限(12 時間) */
export const SNIPE_MAX_SECONDS_LIMIT = 43200

export type SnipeTimeLimits = {
  minSeconds: number // 目標時刻までの最低秒数
  maxSeconds: number // 目標時刻までの最大秒数(SNIPE_MAX_SECONDS_LIMIT で頭打ち)
  secondAdjust: SnipeSecondAdjust // 秒数を丸める単位
}

// 時間に関する正規表現パターン(全角数字・「時」「分」「秒」などの表記ゆれに対応)
const HOUR_PATTERN = /(?:^|[^０-９0-9])([０-９0-9]{1,2})[:：じ時hH]/
const MINUTE_PATTERN = /([０-９0-9]{1,2})(?:[:：分ふんmM])?/
const SECOND_PATTERN = /:?([０-９0-9]{1,2})(?:[秒びょうsS])?/
const TIME_PATTERN = new RegExp(`${HOUR_PATTERN.source}${MINUTE_PATTERN.source}${SECOND_PATTERN.source}`, 'g')
const MINUTES_ONLY_PATTERN = /(?:^|[^０-９0-9])([０-９0-9]{1,2})[分ふんmM]/g
const RELATIVE_TIME_PATTERN = /([０-９0-9]{1,3})([秒びょうsS]|[分ふんmM])後/g

type TimeParts = { hours: number; minutes: number; seconds: number }

// 全角数字を半角にし、HTML タグを削る
const normalizeInput = (input: string): string =>
  input.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0)).replace(/<[^>]*>/g, '')

// 秒を secondAdjust の倍数に切り上げ、時・分に繰り上げる
const adjustTime = (h: number, m: number, s: number, secondAdjust: number): TimeParts => {
  const adjustedSeconds = Math.ceil(s / secondAdjust) * secondAdjust
  const minutes = m + Math.floor(adjustedSeconds / 60)
  return { hours: (h + Math.floor(minutes / 60)) % 24, minutes: minutes % 60, seconds: adjustedSeconds % 60 }
}

// 時刻から今日(過ぎていれば明日)の目標時刻を作る。最大秒数を超えるなら null
const createTargetTime = ({ hours, minutes, seconds }: TimeParts, maxSeconds: number, now: Date): Date | null => {
  const target = new Date(now)
  target.setHours(hours, minutes, seconds, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const diffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000)
  return diffSeconds <= maxSeconds ? target : null
}

// 最低・最大秒数に収める
const validateTimeRange = (targetDate: Date, limits: SnipeTimeLimits, now: Date): Date => {
  const maxSeconds = Math.min(limits.maxSeconds, SNIPE_MAX_SECONDS_LIMIT)
  const minAcceptable = Math.max(limits.minSeconds, limits.secondAdjust)
  const diffSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000)

  if (diffSeconds < minAcceptable) {
    const d = new Date(now.getTime() + minAcceptable * 1000)
    d.setMilliseconds(0)
    return d
  }
  if (diffSeconds > maxSeconds) {
    const d = new Date(now.getTime() + maxSeconds * 1000)
    d.setMilliseconds(0)
    return d
  }
  targetDate.setMilliseconds(0)
  return targetDate
}

// 相対時間(例: 10分後)
const parseRelativeTime = (input: string, secondAdjust: number, now: Date): Date | null => {
  const match = input.match(/([0-9]{1,3})(秒|びょう|s|S|分|ふん|m|M)後/)
  if (!match) return null
  const value = parseInt(match[1])
  if (value <= 0) return null

  const secondsToAdd = /分|ふん|m|M/.test(match[2]) ? value * 60 : value
  const adjusted = adjustTime(now.getHours(), now.getMinutes(), now.getSeconds() + secondsToAdd, secondAdjust)
  const target = new Date(now)
  target.setHours(adjusted.hours, adjusted.minutes, adjusted.seconds, 0)
  return target
}

// 時刻(例: 14:30:45)
const parseFullTime = (input: string, limits: SnipeTimeLimits, now: Date): Date | null => {
  const match = input.match(/([0-9]{1,2})[:：じ時]([0-9]{1,2})(?:[分ふん])?(?:[:：]?([0-9]{1,2})(?:[秒びょう])?)?/)
  if (!match) return null
  const [, h, m, s = '0'] = match
  const parts = adjustTime(parseInt(h), parseInt(m), parseInt(s), limits.secondAdjust)
  if (parts.hours >= 24 || parts.minutes >= 60 || parts.seconds >= 60) return null
  return createTargetTime(parts, Math.min(limits.maxSeconds, SNIPE_MAX_SECONDS_LIMIT), now)
}

// 分だけ(例: 30分)。次にその分になる時刻
const parseMinutesOnly = (input: string, now: Date): Date | null => {
  const match = input.match(/([0-9]{1,2})[分ふんmM]/)
  if (!match) return null
  const minutes = parseInt(match[1])
  if (minutes >= 60) return null
  const target = new Date(now.getTime())
  target.setHours(now.getHours(), minutes, 0, 0)
  if (target <= now) target.setHours(now.getHours() + 1)
  return target
}

/**
 * コメントから目標時刻を取り出す(相対 → 時刻 → 分だけ の順に試す)
 * 時刻の表記が無ければ null。あれば最低・最大秒数に収めた目標時刻を返す
 */
export const parseSnipeTime = (input: string, limits: SnipeTimeLimits, now: Date = new Date()): Date | null => {
  const text = normalizeInput(input)

  const relative = text.match(RELATIVE_TIME_PATTERN)
  if (relative) {
    const result = parseRelativeTime(relative[0].trim(), limits.secondAdjust, now)
    return result ? validateTimeRange(result, limits, now) : null
  }

  const time = text.match(TIME_PATTERN)
  if (time) {
    const result = parseFullTime(time[0].trim(), limits, now)
    return result ? validateTimeRange(result, limits, now) : null
  }

  const minutesOnly = text.match(MINUTES_ONLY_PATTERN)
  if (minutesOnly) {
    const result = parseMinutesOnly(minutesOnly[0].trim(), now)
    return result ? validateTimeRange(result, limits, now) : null
  }

  return null
}

/**
 * 指定した時刻を、秒数を丸める単位にそろえて最低・最大秒数に収める(クリックで開始するとき用)
 */
export const alignSnipeTime = (date: Date, limits: SnipeTimeLimits, now: Date = new Date()): Date | null => {
  const parts = adjustTime(date.getHours(), date.getMinutes(), date.getSeconds(), limits.secondAdjust)
  const target = createTargetTime(parts, Math.min(limits.maxSeconds, SNIPE_MAX_SECONDS_LIMIT), now)
  return target ? validateTimeRange(target, limits, now) : null
}
