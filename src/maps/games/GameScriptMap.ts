// src/maps/games/GameScriptMap.ts
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { GameScriptKey } from '@/types/OmikujiData'

const DOCS = 'https://github.com/Pintocuru/OmikujiBot-Docs'
const MAIN = `${DOCS}/blob/main`
const RAW = `${DOCS}/raw/main`

/**
 * ゲームスクリプトのアイコン
 * label は src/i18n/editor/maps/ScenarioMapMessages.ts にあります
 */
export const gameIcons: Partial<Record<GameScriptKey, LucideIconName>> = {
  GouseiSuika: 'Apple',
  CommentBot: 'Bot',
}

/**
 * ゲームスクリプトのリンク情報
 */
export const gameLinksMap: Partial<Record<GameScriptKey, { url: string; banner: string }>> = {
  GouseiSuika: {
    url: `${MAIN}/2025-Q4/GouseiSuika/GouseiSuika.md`,
    banner: `${RAW}/2025-Q4/GouseiSuika/GouseiSuika.webp`,
  },
  CommentBot: { url: '', banner: '' },
}

export const registerGameScriptMetadata = (
  icons: Partial<Record<GameScriptKey, LucideIconName>>,
  links: Partial<Record<GameScriptKey, { url: string; banner: string }>>
) => {
  Object.assign(gameIcons, icons)
  Object.assign(gameLinksMap, links)
}
