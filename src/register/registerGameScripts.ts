// src/register/registerGameScripts.ts
import { registerGameScript, type GameScriptLoader } from '@/games/gameScriptRegistry'
import type { GameScriptKey } from '@/types/OmikujiData'

// GameScript
export const registerAllGameScripts = () =>
  registerGameScript({
    GouseiSuika: () => import('@/games/scripts/game/GouseiSuika/execute'),
    CommentBot: () => import('@/games/scripts/tool/CommentBot/execute'),
  } satisfies Partial<Record<GameScriptKey, GameScriptLoader>>)
