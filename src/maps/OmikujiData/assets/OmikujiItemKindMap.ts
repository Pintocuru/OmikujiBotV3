// src/maps/OmikujiData/assets/OmikujiItemKindMap.ts
import type { OmikujiControlCommand, OmikujiItemKind } from '@/types/OmikujiData'

/**
 * おみくじアイテム種別のキー一覧
 */
export const omikujiItemKindMap: Record<OmikujiItemKind, true> = {
  scenario: true,
  control: true,
}

/**
 * 制御コマンドのキー一覧
 */
export const omikujiControlCommandMap: Record<OmikujiControlCommand, true> = {
  return: true,
  continue: true,
}
