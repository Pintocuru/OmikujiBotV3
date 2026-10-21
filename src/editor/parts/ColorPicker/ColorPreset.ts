// src/editor/parts/ColorPicker/ColorPreset.ts
import { CharacterColorType } from '@/types/OmikujiData'

// デフォルトキャラクター用のカラーテーマ（マテリアルカラーベース、可読性重視）
export const DEFAULT_COLOR_THEMES: Partial<CharacterColorType>[] = [
  // 1. Red - 情熱的で力強い
  {
    name: '#FFCDD2', // Red 100
    text: '#FFFFFF',
    background: '#C62828',
    accent: '#EF9A9A',
  },
  // 2. Deep Orange - 温かみのあるオレンジ
  {
    name: '#FFCCBC', // Deep Orange 100
    text: '#FFFFFF',
    background: '#D84315',
    accent: '#FFAB91',
  },
  // 3. Orange - 明るく親しみやすい
  {
    name: '#FFE0B2', // Orange 100
    text: '#FFFFFF',
    background: '#EF6C00',
    accent: '#FFCC80',
  },
  // 4. Amber - 暖色系で落ち着いた印象
  {
    name: '#FFECB3', // Amber 100
    text: '#212121',
    background: '#FF8F00',
    accent: '#FFE082',
  },
  // 5. Lime - 爽やかで活発
  {
    name: '#F0F4C3', // Lime 100
    text: '#212121',
    background: '#9E9D24',
    accent: '#E6EE9C',
  },
  // 6. Green - 自然で安定感
  {
    name: '#C8E6C9', // Green 100
    text: '#FFFFFF',
    background: '#2E7D32',
    accent: '#A5D6A7',
  },
  // 7. Teal - クールで洗練された
  {
    name: '#B2DFDB', // Teal 100
    text: '#FFFFFF',
    background: '#00695C',
    accent: '#80CBC4',
  },
  // 8. Light Blue - 爽快で開放的
  {
    name: '#B3E5FC', // Light Blue 100
    text: '#FFFFFF',
    background: '#01579B',
    accent: '#81D4FA',
  },
  // 9. Indigo - 知的で落ち着いた
  {
    name: '#C5CAE9', // Indigo 100
    text: '#FFFFFF',
    background: '#283593',
    accent: '#9FA8DA',
  },
  // 10. Deep Purple - 高貴で神秘的
  {
    name: '#D1C4E9', // Deep Purple 100
    text: '#FFFFFF',
    background: '#4527A0',
    accent: '#B39DDB',
  },
  // 11. Pink - 優しく華やか
  {
    name: '#F8BBD0', // Pink 100
    text: '#FFFFFF',
    background: '#AD1457',
    accent: '#F48FB1',
  },
  // 12. Brown - 温もりのある落ち着き
  {
    name: '#D7CCC8', // Brown 100
    text: '#FFFFFF',
    background: '#4E342E',
    accent: '#BCAAA4',
  },
]
