// src/games/scripts/tool/CommentBot/params.ts
import { COMMENT_THEME_KEYS, CommentThemeKey, MOCK_USER_POOL_MAX } from '@/common/MockUser'

export const DEFAULT_THEME: CommentThemeKey = 'chat'
export const DEFAULT_USER_COUNT = 50

export const isCommentThemeKey = (value: string): value is CommentThemeKey =>
  (COMMENT_THEME_KEYS as string[]).includes(value)

// users は 1〜MOCK_USER_POOL_MAX に丸める(数値でなければ既定値)
export const clampUserCount = (value: string | undefined): number => {
  const n = Number(value)
  if (!value || !Number.isFinite(n)) return DEFAULT_USER_COUNT
  return Math.min(MOCK_USER_POOL_MAX, Math.max(1, Math.floor(n)))
}
