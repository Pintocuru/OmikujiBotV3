// src/ui/CharacterStage/types.ts
import type { CharacterAnimationType, EnterMotionType } from '@/types/OmikujiData'
import type { BotDisplayState, StageAnchorType } from '@/types/ui'

/** 画面に出している画像 1 枚(= 1 メッセージ) */
export type StageItem = {
  id: string
  layers: string[]
  animation?: CharacterAnimationType
  size: number // px
  x: number // % (anchor の点が来る位置)。表示開始時に 1 回だけ抽選
  y: number // % (anchor の点が来る位置)。表示開始時に 1 回だけ抽選
  anchor: StageAnchorType // x・y に置くキャラ画像上の点
  motion: EnterMotionType
  motionDuration: number // 秒。登場・退場に共通
  z: number // 後から出たものほど大きい(前面)
  display: BotDisplayState
}
