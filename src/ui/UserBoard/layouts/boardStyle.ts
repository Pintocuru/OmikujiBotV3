// src/ui/UserBoard/layouts/boardStyle.ts
import type { DaisyUIColorType } from '@/types/core'
import type { UserBoardType } from '@/types/ui'

/**
 * CharacterColorScheme の4色 (name / text / background / accent) を CSS 変数として流し込む (GameRanking と同じ)
 */
export const boardRootStyle = (settings: UserBoardType) => ({
  '--rk-name': settings.color.name,
  '--rk-text': settings.color.text,
  '--rk-bg': settings.color.background,
  '--rk-accent': settings.color.accent,
  backgroundColor: 'var(--rk-bg)',
  color: 'var(--rk-text)',
})

export const mix = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`

/** チーム色 (DaisyUI のテーマ色) */
export const teamColor = (team: DaisyUIColorType) => `var(--color-${team})`
export const teamContentColor = (team: DaisyUIColorType) => `var(--color-${team}-content)`
