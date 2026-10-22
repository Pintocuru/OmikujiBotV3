// src/generator/scripts/CharacterManager/useCharacterManager.ts
import { computed, MaybeRefOrGetter, toValue } from 'vue'
import { CharacterAnimationType, CharacterType } from '@/types/OmikujiData'
import { useAppStore } from '@/generator/stores/useAppStore'
import { BotMessageBubbleType } from '@/types/generator'
import { CharacterManager } from '@/engine/CharacterManager/CharacterManager'

/**
 * Vueコンポーネント用：CharacterManager のリアクティブなラッパー
 */
export const useCharacterManager = (source?: MaybeRefOrGetter<Record<string, CharacterType>>) => {
  // source 未指定ならジェネレーターのstore、指定ならそのデータ（エディターは omikujiStore を渡す）
  const appStore = source ? null : useAppStore()
  const getCharacters = () => (source ? toValue(source) : appStore!.data.assets.characters)

  // CharacterManagerのインスタンス
  const manager = computed(() => new CharacterManager(getCharacters()))

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

  // キャラクター情報を取得
  const getCharacter = (characterKey: string | null): CharacterType | null => {
    return manager.value.getCharacter(characterKey)
  }

  // 表示用のキャラクター名（未定義なら空文字）
  const getCharacterName = (characterKey: string | null): string => {
    const character = manager.value.getCharacter(characterKey)
    if (!character) return ''
    return character.name || character.displayName || character.key
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
    getCharacter,
    getCharacterName,
    getCharacterColor,
    isValidCharacter,
    hasImage,
    resolveEmotion,
    getCharacterAnimation,
    iconSrc,
    resolveCharacter,
  }
}
