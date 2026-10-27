// src/editor/presets/characters.ts
import { characterEmotions } from '@/types/OmikujiData/'
import type { PresetDefinition } from './types'

const emotionLabels: Record<(typeof characterEmotions)[number], string> = {
  default: '通常',
  happy: '嬉しい',
  surprised: '驚き',
  sad: '悲しい',
  angry: '怒り',
  thinking: '考え中',
}

// 画像(src)は空。作成後にエディターで設定する
const image = () =>
  Object.fromEntries(characterEmotions.map((e) => [e, { label: emotionLabels[e], src: [] as string[] }]))

const make = (
  id: string,
  name: string,
  color: { name: string; text: string; background: string; accent: string }
): PresetDefinition<'characters'> => ({
  id,
  category: 'characters',
  build: () => ({ assets: { characters: [{ name, displayName: name, color, image: image() }] } }),
})

export const characterPresets = [
  make('basic', 'サンプル', { name: '#212121', text: '#212121', background: '#FFF3E0', accent: '#FF9800' }),
  make('cool', 'クール', { name: '#0D47A1', text: '#212121', background: '#E3F2FD', accent: '#2196F3' }),
  make('dark', 'ダーク', { name: '#ECEFF1', text: '#ECEFF1', background: '#263238', accent: '#FFC107' }),
]
