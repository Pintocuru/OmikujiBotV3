// src/ui/CommentBubble/parts/previewColor.ts
import type { ComputedRef, InjectionKey } from 'vue'
import type { CharacterColorType } from '@/types/OmikujiData'

/**
 * エディターのプレビュー用: CommentDisplay の色をキャラ検索ではなくこの値に固定する。
 * (エディターでは generator の store が編集中のデータを持たないため)
 */
export const previewColorKey: InjectionKey<ComputedRef<CharacterColorType | undefined>> =
  Symbol('commentBubblePreviewColor')
