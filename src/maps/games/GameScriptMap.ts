// src/maps/OmikujiData/assets/GameScriptMap.ts
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { GameScriptKey } from '@/types/OmikujiData'

const DOCS = 'https://github.com/Pintocuru/OmikujiBot-Docs'
const MAIN = `${DOCS}/blob/main`
const RAW = `${DOCS}/raw/main`

/**
 * ゲームスクリプトのUI表示マップ
 */
export const gameMetaMap: Record<
  GameScriptKey,
  { label: string; description: string; icon: LucideIconName; url: string; banner: string }
> = {
  GouseiSuika: {
    label: 'スイカジェネレーター',
    description: '米兜科技 - 合成大西瓜風のおみくじ',
    icon: 'Apple',
    url: `${MAIN}/2025-Q4/GouseiSuika/GouseiSuika.md`,
    banner: `${RAW}/2025-Q4/GouseiSuika/GouseiSuika.webp`,
  },
  BomberSpin: {
    label: 'ボンバースロット',
    description: 'APPLI - BOMBERSPIN2風のおみくじ',
    icon: 'Bomb',
    url: `${MAIN}/2025-Q4/BomberSpin/BomberSpin.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpin.webp`,
  },
  DwarfBomb: {
    label: 'うさぎスロット',
    description: 'Nolimit City - Fire in the Hole風のおみくじ',
    icon: 'Rabbit',
    url: `${MAIN}/2025-Q4/BomberSpin/DwarfBomb.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpinDwarf.webp`,
  },
  MultiplyBonanza: {
    label: '桜吹雪スロット',
    description: 'Wing - FURAIJIN風のおみくじ',
    icon: 'Flower2',
    url: `${MAIN}/2025-Q4/BomberSpin/MultiplyBonanza.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpinSakura.webp`,
  },
  GoogolClover: {
    label: 'グーゴルクローバー',
    description: 'Future Friends Games - CloverPit風のおみくじ',
    icon: 'Clover',
    url: `${MAIN}/GoogolClover/GoogolClover.md`,
    banner: `${RAW}/GoogolClover/GoogolClover.webp`,
  },
  HugEmAll: {
    label: 'ダンジョンスロット',
    description: 'Nolimit City - Kill Em All風のおみくじ',
    icon: 'Swords',
    url: '',
    banner: '',
  },
  FortuneRanking: {
    label: '占いランキング',
    description: '果物などの順位を作成する拡張スクリプト',
    icon: 'Sparkles',
    url: '',
    banner: '',
  },
  CommentBot: {
    label: 'コメントBOT',
    description: 'BOTとしてわんコメにコメントを自動投稿する拡張スクリプト',
    icon: 'Bot',
    url: '',
    banner: '',
  },
}

/**
 * ゲームスクリプトのアイコン
 */
export const gameIcons: Record<GameScriptKey, LucideIconName> = {
  GouseiSuika: 'Apple',
  BomberSpin: 'Bomb',
  DwarfBomb: 'Rabbit',
  MultiplyBonanza: 'Flower2',
  GoogolClover: 'Clover',
  HugEmAll: 'Swords',
  FortuneRanking: 'Sparkles',
  CommentBot: 'Bot',
}

/**
 * ゲームスクリプトのリンク情報
 */
export const gameLinksMap: Record<GameScriptKey, { url: string; banner: string }> = {
  GouseiSuika: {
    url: `${MAIN}/2025-Q4/GouseiSuika/GouseiSuika.md`,
    banner: `${RAW}/2025-Q4/GouseiSuika/GouseiSuika.webp`,
  },
  BomberSpin: {
    url: `${MAIN}/2025-Q4/BomberSpin/BomberSpin.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpin.webp`,
  },
  DwarfBomb: {
    url: `${MAIN}/2025-Q4/BomberSpin/DwarfBomb.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpinDwarf.webp`,
  },
  MultiplyBonanza: {
    url: `${MAIN}/2025-Q4/BomberSpin/MultiplyBonanza.md`,
    banner: `${RAW}/2025-Q4/BomberSpin/BomberSpinSakura.webp`,
  },
  GoogolClover: {
    url: `${MAIN}/GoogolClover/GoogolClover.md`,
    banner: `${RAW}/GoogolClover/GoogolClover.webp`,
  },
  HugEmAll: { url: '', banner: '' },
  FortuneRanking: { url: '', banner: '' },
  CommentBot: { url: '', banner: '' },
}
