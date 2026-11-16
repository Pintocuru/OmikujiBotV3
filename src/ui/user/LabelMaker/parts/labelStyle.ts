// src/ui/user/LabelMaker/parts/labelStyle.ts
import type { LabelMakerType } from '@/types/ui'

/**
 * CharacterColorSchema の4色 (name / text / background / accent) を CSS 変数として流し込む (UserBoard と同じ)
 */
export const labelRootStyle = (settings: LabelMakerType) => ({
  '--lm-name': settings.color.name,
  '--lm-text': settings.color.text,
  '--lm-bg': settings.color.background,
  '--lm-accent': settings.color.accent,
  backgroundColor: 'var(--lm-bg)',
  color: 'var(--lm-text)',
})

export const mix = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`
