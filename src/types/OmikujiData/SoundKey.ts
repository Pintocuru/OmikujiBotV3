// src/types/OmikujiData/SoundKey.ts
import { z } from 'zod'

/**
 * サウンドキーの種類
 */
export const soundKeys = [
  'cute',
  'bubble',
  'twinkle',
  'bounce',
  'jingle',
  'collect',
  'cash',
  'notification',
  'news',
  'decision',
  'transition',
  'congrats',
  'fanfare',
  'carnival',
  'baseball',
  'warn',
  'cancel',
  'negative',
  'fail',
  'explosion',
] as const

// スキーマと型の定義
export const SoundKeySchema = z.enum(soundKeys)
export type SoundKeyType = z.infer<typeof SoundKeySchema>

// Map定義
export const soundMap: Record<SoundKeyType, { label: string; path: string }> = {
  cute: { label: 'ぽよん', path: 'FreeSound/cute.mp3' },
  bubble: { label: 'ポコン', path: 'FreeSound/bubble.mp3' },
  twinkle: { label: 'キラキラ', path: 'FreeSound/twinkle.mp3' },
  bounce: { label: 'ボヨン', path: 'FreeSound/bounce.mp3' },
  jingle: { label: 'ジングル', path: 'FreeSound/jingle.mp3' },
  collect: { label: '取得音', path: 'FreeSound/collect.mp3' },
  cash: { label: 'お金チャリン', path: 'FreeSound/cash.mp3' },
  notification: { label: '通知音', path: 'FreeSound/notification.mp3' },
  news: { label: 'ニュース風', path: 'FreeSound/news.mp3' },
  decision: { label: '決定音', path: 'FreeSound/decision.mp3' },
  transition: { label: 'トランジション', path: 'FreeSound/transition.mp3' },
  congrats: { label: 'お祝い', path: 'FreeSound/congrats.mp3' },
  fanfare: { label: 'ファンファーレ', path: 'FreeSound/fanfare.mp3' },
  carnival: { label: 'カーニバル', path: 'FreeSound/carnival.mp3' },
  baseball: { label: 'レベルアップ', path: 'FreeSound/baseball.mp3' },
  warn: { label: 'ブレーキ', path: 'FreeSound/warn.mp3' },
  cancel: { label: 'キャンセル', path: 'FreeSound/cancel.mp3' },
  negative: { label: 'ざんねん', path: 'FreeSound/negative.mp3' },
  fail: { label: '失敗', path: 'FreeSound/fail.mp3' },
  explosion: { label: '爆発', path: 'FreeSound/explosion.mp3' },
}
