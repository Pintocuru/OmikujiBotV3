// src/types/ui/CommentBubbleSchema.ts
import { z } from 'zod'
import { enterMotions } from '../OmikujiData/assets/EnterMotionSchema'
import { CharacterAnimationType } from '../OmikujiData/assets/CharacterSchema'

// レイアウトに渡す「現在表示するキャラクター」
export type ShownCharacter = {
  key: string
  layers: string[]
  animation?: CharacterAnimationType
}

/**
 * フキダシ・キャラクター
 */
// CommentBubble のコンポーネントセット
export const bubbleComponentSets = {
  standard: ['standard', 'smart'],
} as const

export type BubbleComponentSets = typeof bubbleComponentSets
export type BubbleComponentSet = keyof BubbleComponentSets

// セット別の ID 型
export type BubbleComponentOf<S extends BubbleComponentSet> = BubbleComponentSets[S][number]

// 全 ID
export type BubbleComponent = BubbleComponentOf<BubbleComponentSet>

export const CommentBubbleSchema = z.object({
  component: z.string().min(1).default('standard').catch('standard'), // 保存データは文字列(未同梱の ID も保持する。空文字は standard に戻す)
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
