// src/engine/CharacterManager/CharacterManager.ts
import { CharacterType, CharacterColorType } from '@/types/OmikujiData'

/**
 * キャラクター情報を管理
 *
 * キャラクターの存在・画像・表情など、キャラクター固有の処理を担当する。
 * アクセス権限やライセンスによる有効/無効判定は行わない。
 */
export class CharacterManager {
  readonly characterMap: Map<string, CharacterType>
  readonly characterArray: CharacterType[]

  constructor(charactersData: Record<string, CharacterType>) {
    this.characterMap = this.createCharacterMap(charactersData)

    // Mapから配列を生成
    this.characterArray = Array.from(this.characterMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  /**
   * キャラクターの妥当性を検証し、適切なキーと表情を返す
   *
   * キャラクター定義が存在すれば、そのキャラクターキーを維持する。
   * 指定された表情の画像が存在しない場合は、利用可能な表情へフォールバックする。
   */
  resolveCharacter(data: { characterKey: string | null; iconKey: string }) {
    const { characterKey, iconKey } = data

    const exists = characterKey ? this.characterMap.has(characterKey) : false

    const resolvedCharacterKey = exists ? characterKey : null
    const resolvedEmotion = this.resolveEmotion(resolvedCharacterKey, iconKey)

    return {
      ...data,
      characterKey: resolvedCharacterKey,
      iconKey: resolvedEmotion,
    }
  }

  /**
   * キャラクター情報を取得
   */
  getCharacter(characterKey: string | null): CharacterType | null {
    if (!characterKey) return null
    return this.characterMap.get(characterKey) ?? null
  }

  /**
   * キャラクターキーから色を取得
   */
  getCharacterColor(characterKey: string | null): CharacterColorType | null {
    if (!characterKey) return null

    const character = this.getCharacter(characterKey)
    return character?.color ?? null
  }

  /**
   * 指定されたキャラクターが定義されているか確認
   */
  isValidCharacter(characterKey: string | null): boolean {
    if (!characterKey) return false
    return this.characterMap.has(characterKey)
  }

  /**
   * 指定されたキャラクターが画像アセットを持っているか確認
   */
  hasImage(characterKey: string | null): boolean {
    if (!characterKey) return false

    const character = this.characterMap.get(characterKey)
    if (!character) return false

    return Object.values(character.image).some((item) => item?.src.some((path) => path && path.trim()))
  }

  /**
   * 指定された表情の画像アセットが存在するか確認。
   * 存在しない場合はdefault表情へフォールバックする。
   */
  resolveEmotion(characterKey: string | null, iconKey?: string): string {
    if (!characterKey || !iconKey) return 'default'

    const character = this.characterMap.get(characterKey)
    if (!character) return 'default'

    const hasTarget = character.image?.[iconKey]?.src.some((path) => path && path.trim()) ?? false

    if (hasTarget) return iconKey

    const hasDefault = character.image?.default?.src.some((path) => path && path.trim()) ?? false

    if (hasDefault) return 'default'

    // defaultもない場合は最初の有効な感情キーにフォールバック
    const fallbackKey = Object.entries(character.image).find(([, item]) =>
      item?.src.some((path) => path && path.trim())
    )?.[0]

    return fallbackKey ?? 'default'
  }

  /**
   * キャラクターとアイコンから画像URLを取得
   */
  iconSrc(characterKey: string | null, iconKey = 'default'): string[] {
    if (!characterKey) return []

    const character = this.characterMap.get(characterKey)
    if (!character) return []

    const getSrc = (key: string) => character.image?.[key]?.src.filter((path) => path && path.trim()) ?? []

    const target = getSrc(iconKey)
    if (target.length > 0) return target

    const defaultSrc = getSrc('default')
    if (defaultSrc.length > 0) return defaultSrc

    // defaultもなければ最初の有効なsrcを返す
    for (const item of Object.values(character.image)) {
      const src = item?.src.filter((path) => path && path.trim()) ?? []

      if (src.length > 0) return src
    }

    return []
  }

  /**
   * characterMapを生成
   */
  private createCharacterMap(characters: Record<string, CharacterType>): Map<string, CharacterType> {
    return new Map(Object.values(characters).map((character) => [character.key, character]))
  }
}
