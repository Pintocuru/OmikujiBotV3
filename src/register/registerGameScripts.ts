// src/register/registerGameScripts.ts
import { registerGameScript, type GameScriptLoader } from '@/games/gameScriptRegistry'
import type { GameScriptKey } from '@/types/OmikujiData'

// GameScript
export const registerAllGameScripts = () =>
  registerGameScript({
    GouseiSuika: () => import('@/games/scripts/game/GouseiSuika/execute'),
    BomberSpin: () => import('@/games/scripts/game/BomberSpin/execute'),
    DwarfBomb: () => import('@/games/scripts/game/DwarfBomb/execute'),
    MultiplyBonanza: () => import('@/games/scripts/game/MultiplyBonanza/execute'),
    GoogolClover: () => import('@/games/scripts/game/GoogolClover/execute'),
    HugEmAll: () => import('@/games/scripts/game/HugEmAll/execute'),
    FortuneRanking: () => import('@/games/scripts/tool/FortuneRanking/execute'),
    CommentBot: () => import('@/games/scripts/tool/CommentBot/execute'),
    SnipeTimer: () => import('@/games/scripts/tool/SnipeTimer/execute'),
  } satisfies Record<GameScriptKey, GameScriptLoader>)
