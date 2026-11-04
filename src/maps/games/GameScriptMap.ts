// src/maps/games/GameScriptMap.ts
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { GameScriptKey } from '@/types/OmikujiData'

const DOCS = 'https://github.com/Pintocuru/OmikujiBot-Docs'
const MAIN = `${DOCS}/blob/main`
const RAW = `${DOCS}/raw/main`

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
