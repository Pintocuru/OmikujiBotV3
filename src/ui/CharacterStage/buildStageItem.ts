// src/ui/CharacterStage/buildStageItem.ts
import type { CharacterAnimationType } from '@/types/OmikujiData'
import { pickInRange, type StageSpec } from './resolveStageSlots'
import type { StageItem } from './types'

type BuildStageItemParams = {
  id: string
  layers: string[]
  animation?: CharacterAnimationType
  spec: StageSpec
  characterSize: number // UI 設定の標準の横幅(px)。spec.scale がかかる
  z: number
  random?: () => number
}

/** 表示指定から、画面に出す 1 枚を作る(本番の表示とエディターのプレビューで共用) */
export const buildStageItem = ({
  id,
  layers,
  animation,
  spec,
  characterSize,
  z,
  random,
}: BuildStageItemParams): StageItem => ({
  id,
  layers,
  animation,
  size: Math.round(characterSize * spec.scale),
  x: pickInRange(spec.xMin, spec.xMax, random),
  y: pickInRange(spec.yMin, spec.yMax, random),
  motion: spec.motion,
  z,
  display: { visible: true, hideTimeout: undefined },
})
