// src/editor/assets/characters/CharacterImage/composables/useEmotionDraft.ts
import { ref } from 'vue'
import type { CharacterImageSetType, CharacterImageType, CharacterAnimationType } from '@/types/OmikujiData'

/**
 * 感情1件ぶんのドラフト。編集ダイアログで選択中の感情だけを複製して持ち、
 * 保存時に呼び出し側がその1キーだけを書き戻す(他の感情は触らない)
 */
export function useEmotionDraft(getModelValue: () => CharacterImageSetType) {
  const originalKey = ref<string | null>(null) // 編集を始めたときのキー(書き戻し先の特定に使う。編集中も変わらない)
  const draftKey = ref<string | null>(null) // 編集中のキー(変更可能)
  const draftItem = ref<CharacterImageType | null>(null)

  const initDraft = (key: string) => {
    const source = getModelValue()[key]
    originalKey.value = source ? key : null
    draftKey.value = source ? key : null
    draftItem.value = source ? JSON.parse(JSON.stringify(source)) : null
  }

  // ── 個別更新 ──────────────────────────────────────────────────────────────

  const updateSrc = (src: string[]) => {
    if (!draftItem.value) return
    draftItem.value = { ...draftItem.value, src }
  }

  const updateKey = (key: string) => {
    if (!draftItem.value) return
    draftKey.value = key
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
    originalKey,
    draftKey,
    draftItem,
    initDraft,
    updateKey,
    updateSrc,
    updateLabel,
    updateAnimation,
  }
}
