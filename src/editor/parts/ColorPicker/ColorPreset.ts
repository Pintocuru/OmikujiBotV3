// src/editor/parts/ColorPicker/ColorPreset.ts
import { CharacterColorType } from '@/types/OmikujiData'

// デフォルトキャラクター用のカラーテーマ（マテリアルカラーベース、可読性重視）
export const DEFAULT_COLOR_THEMES: Partial<CharacterColorType>[] = [
  // 1. Red - 情熱的で力強い
  {
    name: 'Red',
    text: '#FFFFFF',
    background: '#C62828',
    accent: '#EF9A9A',
  },
  // 2. Deep Orange - 温かみのあるオレンジ
  {
    name: 'Deep Orange',
    text: '#FFFFFF',
    background: '#D84315',
    accent: '#FFAB91',
  },
  // 3. Orange - 明るく親しみやすい
  {
    name: 'Orange',
    text: '#FFFFFF',
    background: '#EF6C00',
    accent: '#FFCC80',
  },
  // 4. Amber - 暖色系で落ち着いた印象
  {
    name: 'Amber',
    text: '#212121',
    background: '#FF8F00',
    accent: '#FFE082',
  },
  // 5. Lime - 爽やかで活発
  {
    name: 'Lime',
    text: '#212121',
    background: '#9E9D24',
    accent: '#E6EE9C',
  },
  // 6. Green - 自然で安定感
  {
    name: 'Green',
    text: '#FFFFFF',
    background: '#2E7D32',
    accent: '#A5D6A7',
  },
  // 7. Teal - クールで洗練された
  {
    name: 'Teal',
    text: '#FFFFFF',
    background: '#00695C',
    accent: '#80CBC4',
  },
  // 8. Light Blue - 爽快で開放的
  {
    name: 'Light Blue',
    text: '#FFFFFF',
    background: '#01579B',
    accent: '#81D4FA',
  },
  // 9. Indigo - 知的で落ち着いた
  {
    name: 'Indigo',
    text: '#FFFFFF',
    background: '#283593',
    accent: '#9FA8DA',
  },
  // 10. Deep Purple - 高貴で神秘的
  {
    name: 'Deep Purple',
    text: '#FFFFFF',
    background: '#4527A0',
    accent: '#B39DDB',
  },
  // 11. Pink - 優しく華やか
  {
    name: 'Pink',
    text: '#FFFFFF',
    background: '#AD1457',
    accent: '#F48FB1',
  },
  // 12. Brown - 温もりのある落ち着き
  {
    name: 'Brown',
    text: '#FFFFFF',
    background: '#4E342E',
    accent: '#BCAAA4',
  },
]
