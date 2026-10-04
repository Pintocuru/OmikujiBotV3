// src/generator/scripts/CharacterManager/useCharacterManager.ts
import { computed } from 'vue'
import { CharacterAnimationType } from '@/types/OmikujiData'
import { useAppStore } from '@/generator/stores/useAppStore'
import { BotMessageBubbleType } from '@/generator/types'
import { CharacterManager } from '@/engine/CharacterManager/CharacterManager'

/**
 * Vueコンポーネント用：CharacterManager のリアクティブなラッパー
 */
export const useCharacterManager = () => {
  const appStore = useAppStore()

  // CharacterManagerのシングルトンインスタンス
  const manager = computed(() => new CharacterManager(appStore.data.assets.characters))

  // キャラクターの配列（順序付き）
  const characterMap = computed(() => Object.fromEntries(manager.value.characterMap))
  const characterArray = computed(() => manager.value.characterArray)

  // メッセージからキャラクター画像レイヤーを取得
  const getCharacterLayers = (message: BotMessageBubbleType): string[] => {
    const key = message.bubble?.characterKey
    if (!key || !manager.value.isValidCharacter(key)) return []

    const emotion = manager.value.resolveEmotion(key, message.bubble?.iconKey)

    return manager.value.iconSrc(key, emotion)
  }

  // キャラクターキーから色情報を取得
  const getCharacterColor = (characterKey: string | null) => {
    return manager.value.getCharacterColor(characterKey)
  }

  // キャラクターが定義されているか確認
  const isValidCharacter = (characterKey: string | null): boolean => {
    return manager.value.isValidCharacter(characterKey)
  }

  // キャラクターが画像を持っているか確認
  const hasImage = (characterKey: string | null): boolean => {
    return manager.value.hasImage(characterKey)
  }

  // 表情を解決
  const resolveEmotion = (characterKey: string, iconKey?: string): string => {
    return manager.value.resolveEmotion(characterKey, iconKey)
  }

  // アニメーションを取得
  const getCharacterAnimation = (message: BotMessageBubbleType): CharacterAnimationType | undefined => {
    const key = message.bubble?.characterKey
    if (!key || !manager.value.isValidCharacter(key)) {
      return undefined
    }

    const character = manager.value.getCharacter(key)
    if (!character) return undefined

    const iconKey = manager.value.resolveEmotion(key, message.bubble?.iconKey ?? 'default')

    return character.image[iconKey]?.animation
  }

  // アイコン画像のURLを取得
  const iconSrc = (characterKey: string | null, iconKey?: string): string[] => {
    return manager.value.iconSrc(characterKey, iconKey)
  }

  // キャラクターとアイコンを解決
  const resolveCharacter = (data: { characterKey: string | null; iconKey: string }) => {
    return manager.value.resolveCharacter(data)
  }

  return {
    // リアクティブなプロパティ
    characterMap,
    characterArray,

    // メソッド
    getCharacterLayers,
    getCharacterColor,
    isValidCharacter,
    hasImage,
    resolveEmotion,
    getCharacterAnimation,
    iconSrc,
    resolveCharacter,
  }
}
