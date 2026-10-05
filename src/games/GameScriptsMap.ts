// src/games/GameScriptsMap.ts

/**
 * ゲーム実行map
 */
export const gameExecuteMap = {
  GouseiSuika: () => import('./scripts/GouseiSuika/execute'),
  BomberSpin: () => import('./scripts/BomberSpin/execute'),
  DwarfBomb: () => import('./scripts/DwarfBomb/execute'),
  MultiplyBonanza: () => import('./scripts/MultiplyBonanza/execute'),
  GoogolClover: () => import('./scripts/GoogolClover/execute'),
  HugEmAll: () => import('./scripts/HugEmAll/execute'),
  WinnerGroup: () => import('./scripts/WinnerGroup/execute'),
} satisfies Record<ScriptGameKey, () => Promise<{ default: ScriptClass }>>
