// src/games/gameScriptMeta.ts
import type { GameScriptKey } from '@/types/OmikujiData'
import type { GameScriptMeta } from '@/games/types'
import { gouseiSuikaMeta } from '@/games/scripts/game/GouseiSuika/meta'
import { bomberSpinMeta } from '@/games/scripts/game/BomberSpin/meta'
import { dwarfBombMeta } from '@/games/scripts/game/DwarfBomb/meta'
import { multiplyBonanzaMeta } from '@/games/scripts/game/MultiplyBonanza/meta'
import { googolCloverMeta } from '@/games/scripts/game/GoogolClover/meta'
import { hugEmAllMeta } from '@/games/scripts/game/HugEmAll/meta'
import { fortuneRankingMeta } from '@/games/scripts/tool/FortuneRanking/meta'
import { commentBotMeta } from '@/games/scripts/tool/CommentBot/meta'
import { snipeTimerMeta } from '@/games/scripts/tool/SnipeTimer/meta'

// 入出力の宣言 (GameScriptKey の全キーに必須)
const metas: Record<GameScriptKey, GameScriptMeta> = {
  GouseiSuika: gouseiSuikaMeta,
  BomberSpin: bomberSpinMeta,
  DwarfBomb: dwarfBombMeta,
  MultiplyBonanza: multiplyBonanzaMeta,
  GoogolClover: googolCloverMeta,
  HugEmAll: hugEmAllMeta,
  FortuneRanking: fortuneRankingMeta,
  CommentBot: commentBotMeta,
  SnipeTimer: snipeTimerMeta,
}

export const getGameScriptMeta = (key: GameScriptKey): GameScriptMeta => metas[key]
