// src/ui/CommentBubble/layouts/types.ts
import type { CharacterAnimationType } from '@/types/OmikujiData'

/** レイアウトに渡す「現在表示するキャラクター」 */
export type ShownCharacter = {
  key: string
  layers: string[]
  animation?: CharacterAnimationType
}
