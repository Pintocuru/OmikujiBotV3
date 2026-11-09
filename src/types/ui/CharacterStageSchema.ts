// src/types/ui/CharacterStageSchema.ts
import { z } from 'zod'

/** 位置(X・Y)が、キャラ画像のどの点を指すか。bottom = 下辺の中央(従来の挙動) */
export const stageAnchors = [
  'topLeft', 'top', 'topRight',
  'left', 'center', 'right',
  'bottomLeft', 'bottom', 'bottomRight',
] as const
export type StageAnchorType = (typeof stageAnchors)[number]

/**
 * キャラクターステージ(キャラクター画像だけを、指定位置・指定秒数で表示する演出用 UI)
 * - UI 設定はない(空のオブジェクト)。UiKind として登録するためにスキーマだけ残している
 * - 投稿ごとの指定は CharacterStageSlotMap。空の slot の既定値は ui/CharacterStage/resolveStageSlots.ts の STAGE_DEFAULTS
 * - 位置は % (X は画面左端が 0、Y は画面上端が 0)。キャラ画像のどの点をその位置に置くかは anchor(基準点)で決める
 */
export const CharacterStageSchema = z.object({})
export type CharacterStageType = z.infer<typeof CharacterStageSchema>
