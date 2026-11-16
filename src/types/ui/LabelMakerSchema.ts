// src/types/ui/LabelMakerSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../core'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'

/**
 * ラベルメーカー LabelMaker
 * 投稿で届いたユーザーを、名前ラベルのリストとして表示する(旧 CounterPreview のユーザーリスト部分)
 */
// LabelMaker のコンポーネントセット
// - userList: ユーザー名のバッジを、折り返しながら並べる
// - userCardScroller: ユーザーのカードを縦に並べ、新しいユーザーを右から滑り込ませる
export const labelMakerComponentSets = {
  standard: ['userList', 'userCardScroller'],
} as const

export type LabelMakerComponentSets = typeof labelMakerComponentSets
export type LabelMakerComponentSet = keyof LabelMakerComponentSets

// セット別の ID 型
export type LabelMakerComponentOf<S extends LabelMakerComponentSet> = LabelMakerComponentSets[S][number]

// 全 ID
export type LabelMakerComponent = LabelMakerComponentOf<LabelMakerComponentSet>

/**
 * ユーザーの数え方
 * - user: 同じユーザーは 1 回だけ載せる(最後に届いた位置)
 * - draw: 届くたびに載せる(同じユーザーが何度も載る)
 */
export const labelMakerTargets = ['user', 'draw'] as const
export type LabelMakerTarget = (typeof labelMakerTargets)[number]

export const LabelMakerSchema = z.object({
  component: z.string().min(1).default('userList').catch('userList'), // 表示するコンポーネント(保存データは文字列。未同梱の ID も保持する。空文字は userList に戻す)
  color: normalizedObject(CharacterColorSchema, 'ui.LabelMaker.color'),
  target: z.enum(labelMakerTargets).default('user').catch('user'), // ユーザーの数え方
  limit: z.number().min(1).max(100).default(20).catch(20), // 表示件数(新しい順に、この件数まで)
})
export type LabelMakerType = z.infer<typeof LabelMakerSchema>
