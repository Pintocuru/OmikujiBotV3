// src/types/ui/LiveClockSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../core'
import { CharacterColorScheme } from '../OmikujiData/assets/CharacterSchema'

/**
 * ライブクロック LiveClock
 */
export interface ClockComponentConfig {
  label: string
  isColor: boolean
}
export const clockComponents = ['morning', 'soundPlayer', 'clearGlass', 'steampunk', 'disco'] as const
export type ClockComponent = (typeof clockComponents)[number]

const defaultMessage = `<<
  'チャンネル登録・高評価、お願いします！',
  '現在の視聴数 【<<viewer>>】 / 高評価 【<<upVote>>】',
  'コメントはお気軽にどうぞ！',
  '【<<commenter>>名】がコメントしてくれてます！',
  '【<<winner>>さん】もコメントありがとう！',
  '応援してくれると励みになります！',
  '高評価が配信の支えになります！',
  'コメントがあると、配信が賑やかになります！気軽にどうぞ！',
  '登録者数【<<follower>>】人 ご視聴ありがとうございます'
>>`

export const LiveClockSchema = z.object({
  component: z.enum(clockComponents).default('morning').catch('morning'),
  color: normalizedObject(CharacterColorScheme), // キャラクター配色 (name / text / background / accent)
  isSecond: z.boolean().default(false).catch(false), // 秒数を入れるか
  isDate: z.boolean().default(false).catch(false), // 日付をいれるか
  defaultMessage: z.string().default(defaultMessage).catch(defaultMessage),
})
export type LiveClockType = z.infer<typeof LiveClockSchema>
