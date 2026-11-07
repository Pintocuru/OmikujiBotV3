// src/common/Characters/useCharacters.ts
import { computed, MaybeRefOrGetter, toValue } from 'vue'
import { CharacterAnimationType, CharacterType } from '@/types/OmikujiData'
import { BotMessageBubbleType } from '@/types/generator'
import { CharacterResolver } from '@/engine/CharacterResolver/CharacterResolver'

/**
 * Vueコンポーネント用：CharacterResolver のリアクティブなラッパー
 * source にキャラクターの一覧を渡す。
 * (エディターは omikujiStore、ジェネレーターは appStore のデータを渡す。ジェネレーター側は useAppCharacters が渡す)
 */
export const useCharacters = (source: MaybeRefOrGetter<Record<string, CharacterType>>) => {
  const getCharacters = () => toValue(source)

  // CharacterResolverのインスタンス
  const manager = computed(() => new CharacterResolver(getCharacters()))

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
  const getCharacterColor = (characterKey: string) => {
    return manager.value.getCharacterColor(characterKey)
  }

  // キャラクター情報を取得
  const getCharacter = (characterKey: string): CharacterType | null => {
    return manager.value.getCharacter(characterKey)
  }

  // 表示用のキャラクター名（未定義なら空文字）
  const getCharacterName = (characterKey: string): string => {
    const character = manager.value.getCharacter(characterKey)
    if (!character) return ''
    return character.name || character.displayName || character.key
  }

  // キャラクターが定義されているか確認
  const isValidCharacter = (characterKey: string): boolean => {
    return manager.value.isValidCharacter(characterKey)
  }

  // キャラクターが画像を持っているか確認
  const hasImage = (characterKey: string): boolean => {
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
  const iconSrc = (characterKey: string, iconKey?: string): string[] => {
    return manager.value.iconSrc(characterKey, iconKey)
  }

  // キャラクターとアイコンを解決
  const resolveCharacter = (data: { characterKey: string; iconKey: string }) => {
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
