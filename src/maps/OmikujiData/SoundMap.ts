// src/maps/OmikujiData/SoundMap.ts
import type { SoundKeyType } from '@/types/OmikujiData'

/**
 * サウンドファイルのパスマップ
 */
export const soundMap: Record<SoundKeyType, string> = {
  cute: 'core/cute.mp3',
  bubble: 'core/bubble.mp3',
  twinkle: 'core/twinkle.mp3',
  bounce: 'core/bounce.mp3',
  jingle: 'core/jingle.mp3',
  collect: 'core/collect.mp3',
  cash: 'core/cash.mp3',
  notification: 'core/notification.mp3',
  news: 'core/news.mp3',
  decision: 'core/decision.mp3',
  transition: 'core/transition.mp3',
  congrats: 'core/congrats.mp3',
  fanfare: 'core/fanfare.mp3',
  carnival: 'core/carnival.mp3',
  baseball: 'core/baseball.mp3',
  warn: 'core/warn.mp3',
  cancel: 'core/cancel.mp3',
  negative: 'core/negative.mp3',
  fail: 'core/fail.mp3',
  explosion: 'core/explosion.mp3',
}
