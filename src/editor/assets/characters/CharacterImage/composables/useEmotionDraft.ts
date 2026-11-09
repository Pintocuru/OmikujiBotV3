// src/editor/assets/characters/CharacterImage/composables/useEmotionDraft.ts
import { ref } from 'vue'
import type { CharacterImageSetType, CharacterImageType, CharacterAnimationType } from '@/types/OmikujiData'

/**
 * 感情1件ぶんのドラフト。編集ダイアログで選択中の感情だけを複製して持ち、
 * 保存時に呼び出し側がその1キーだけを書き戻す(他の感情は触らない)
 */
export function useEmotionDraft(getModelValue: () => CharacterImageSetType) {
  const draftKey = ref<string | null>(null)
  const draftItem = ref<CharacterImageType | null>(null)

  const initDraft = (key: string) => {
    const source = getModelValue()[key]
    draftKey.value = source ? key : null
    draftItem.value = source ? JSON.parse(JSON.stringify(source)) : null
  }

  // ── 個別更新 ──────────────────────────────────────────────────────────────

  const updateSrc = (src: string[]) => {
    if (!draftItem.value) return
    draftItem.value = { ...draftItem.value, src }
  }

  const updateLabel = (label: string) => {
    if (!draftItem.value) return
    draftItem.value = { ...draftItem.value, label }
  }

  const updateAnimation = (animation: CharacterAnimationType | undefined) => {
    if (!draftItem.value) return
    const { animation: _old, ...rest } = draftItem.value
    draftItem.value = animation ? { ...rest, animation } : { ...rest }
  }

  return {
    draftKey,
    draftItem,
    initDraft,
    updateSrc,
    updateLabel,
    updateAnimation,
  }
}
