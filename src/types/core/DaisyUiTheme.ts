// src/types/core/DaisyUiTheme.ts
import z from 'zod'

// テーマのリスト
export const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'caramellatte',
  'abyss',
  'silk',
] as const
export const ThemeSchema = z.enum(themes).default('dark').catch('dark')
export type ThemeType = (typeof themes)[number]

// カラー
export const daisyUIColor = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
] as const
export const DaisyUIColorSchema = z.enum(daisyUIColor).default('primary').catch('primary')
export type DaisyUIColorType = (typeof daisyUIColor)[number]
