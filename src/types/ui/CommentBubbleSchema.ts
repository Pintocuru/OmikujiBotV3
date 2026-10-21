// src/types/ui/CommentBubbleSchema.ts
import { z } from 'zod'
import { CharacterAnimationType, enterMotions } from '../OmikujiData'

// レイアウトに渡す「現在表示するキャラクター」
export type ShownCharacter = {
  key: string
  layers: string[]
  animation?: CharacterAnimationType
}

/**
 * フキダシ・キャラクター
 */
// コンポーネントの選択肢(表示名は src/maps/ui/CommentBubbleMap.ts)
export const bubbleComponents = ['standard', 'smart'] as const
export type BubbleComponent = (typeof bubbleComponents)[number]

export const CommentBubbleSchema = z.object({
  component: z.enum(bubbleComponents).default('standard').catch('standard'),
  persistentCharacter: z.string().catch(''), // 常時表示キャラ(空ならコメントが来るまで非表示)
  characterSize: z.number().default(128).catch(128), // キャラクターの横幅
  bubbleMotion: z.enum(enterMotions).default('slideUp').catch('slideUp'), // フキダシのアニメーション
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>

/**
 * 表示中メッセージの実行時状態(UI の責務。generator / engine は関知しない)
 * - 保存・受け渡しするデータではないため zod スキーマにしない
 * - hideTimeout は setTimeout のハンドル(スキーマにできない値)
 */
export type BotDisplayState = {
  visible: boolean // false にすると Leave アニメーションが始まる
  hideTimeout?: number // 自動非表示のタイマー
}
// 任意のメッセージ型に表示状態を付与する(useBotDisplay が生成するため display は必須)
export type WithDisplay<T> = T & { display: BotDisplayState }
