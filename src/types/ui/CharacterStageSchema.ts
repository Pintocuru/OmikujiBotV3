// src/types/ui/CharacterStageSchema.ts
import { z } from 'zod'
import { enterMotions } from '../OmikujiData/assets/EnterMotionSchema'

/**
 * キャラクターステージ(キャラクター画像だけを、指定位置・指定秒数で表示する演出用 UI)
 * - ここは「slots が空のときの既定値」。投稿ごとの指定は CharacterStageSlotMap(slot0〜7)で上書きする
 * - 位置は % 。X はキャラの中心、Y はキャラの下辺が基準(Y は画面上端が 0、下端が 100)
 */
const percent = (fallback: number) => z.number().min(0).max(100).default(fallback).catch(fallback)

export const CharacterStageSchema = z.object({
  characterSize: z.number().min(16).default(256).catch(256), // キャラクターの標準の横幅(px)。投稿側は倍率だけ渡す
  seconds: z.number().min(0).default(10).catch(10), // 既定の表示秒数(0 は無期限)
  xMin: percent(20), // 既定の位置 X 最小
  xMax: percent(80), // 既定の位置 X 最大
  yMin: percent(100), // 既定の位置 Y 最小
  yMax: percent(100), // 既定の位置 Y 最大
  motion: z.enum(enterMotions).default('fade').catch('fade'), // 既定の登場・退場モーション
})
export type CharacterStageType = z.infer<typeof CharacterStageSchema>
