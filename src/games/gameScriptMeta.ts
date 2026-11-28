// src/games/gameScriptMeta.ts
import type { GameScriptKey } from '@/types/OmikujiData'
import type { GameScriptMeta } from '@/games/types'
import { gouseiSuikaMeta } from '@/games/scripts/game/GouseiSuika/meta'
import { commentBotMeta } from '@/games/scripts/tool/CommentBot/meta'

const metas: Partial<Record<GameScriptKey, GameScriptMeta>> = {
  GouseiSuika: gouseiSuikaMeta,
  CommentBot: commentBotMeta,
}

export const getGameScriptMeta = (key: GameScriptKey): GameScriptMeta | undefined => metas[key]

export const registerGameScriptMetas = (entries: Partial<Record<GameScriptKey, GameScriptMeta>>) =>
  Object.assign(metas, entries)
