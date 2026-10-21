// src/maps/OmikujiData/SoundMap.ts
import { SoundKeyType } from '@/types/OmikujiData'

// Map定義
export const soundMap: Record<SoundKeyType, { label: string; path: string }> = {
  cute: { label: 'ぽよん', path: 'core/cute.mp3' },
  bubble: { label: 'ポコン', path: 'core/bubble.mp3' },
  twinkle: { label: 'キラキラ', path: 'core/twinkle.mp3' },
  bounce: { label: 'ボヨン', path: 'core/bounce.mp3' },
  jingle: { label: 'ジングル', path: 'core/jingle.mp3' },
  collect: { label: '取得音', path: 'core/collect.mp3' },
  cash: { label: 'お金チャリン', path: 'core/cash.mp3' },
  notification: { label: '通知音', path: 'core/notification.mp3' },
  news: { label: 'ニュース風', path: 'core/news.mp3' },
  decision: { label: '決定音', path: 'core/decision.mp3' },
  transition: { label: 'トランジション', path: 'core/transition.mp3' },
  congrats: { label: 'お祝い', path: 'core/congrats.mp3' },
  fanfare: { label: 'ファンファーレ', path: 'core/fanfare.mp3' },
  carnival: { label: 'カーニバル', path: 'core/carnival.mp3' },
  baseball: { label: 'レベルアップ', path: 'core/baseball.mp3' },
  warn: { label: 'ブレーキ', path: 'core/warn.mp3' },
  cancel: { label: 'キャンセル', path: 'core/cancel.mp3' },
  negative: { label: 'ざんねん', path: 'core/negative.mp3' },
  fail: { label: '失敗', path: 'core/fail.mp3' },
  explosion: { label: '爆発', path: 'core/explosion.mp3' },
}
