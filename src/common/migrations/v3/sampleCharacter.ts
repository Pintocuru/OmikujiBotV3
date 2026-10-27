// src/common/migrations/v3/sampleCharacter.ts
import { CharacterSchema, OmikujiDataType } from '@/types/OmikujiData'

export const SAMPLE_CHARACTER_KEY = 'omiken'

/**
 * assets.characters が空の場合のみ、サンプルキャラクターを追加する
 */
export function ensureSampleCharacters(data: OmikujiDataType): OmikujiDataType {
  if (Object.keys(data.assets.characters).length > 0) return data

  const sample = CharacterSchema.parse({
    key: SAMPLE_CHARACTER_KEY,
    name: 'サンプル',
    displayName: 'サンプル',
    order: 1,
    color: { name: '#212121', text: '#212121', background: '#FFF3E0', accent: '#FF9800' },
    image: {
      default: { label: 'default', src: [] },
      happy: { label: 'happy', src: [] },
      surprised: { label: 'surprised', src: [] },
      sad: { label: 'sad', src: [] },
      angry: { label: 'angry', src: [] },
      thinking: { label: 'thinking', src: [] },
    },
  })

  return {
    ...data,
    assets: { ...data.assets, characters: { [sample.key]: sample } },
  }
}
