// src/ui/CharacterStage/resolveStageSlots.ts
import { enterMotions, type EnterMotionType } from '@/types/OmikujiData'
import type { BotMessageSlotsType } from '@/types/generator'
import { stageAnchors, type StageAnchorType } from '@/types/ui'

/** slots(空なら既定値)から決まる、1 メッセージ分の表示指定 */
export type StageSpec = {
  seconds: number // 0 は無期限
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  anchor: StageAnchorType // xMin〜yMax の位置に置く、キャラ画像上の点
  scale: number
  motion: EnterMotionType
  clearPrevious: boolean
  motionDuration: number // 秒。登場・退場のモーションに共通
}

/** slots が空のときの既定値(UI 設定はないので、ここで決める) */
export const STAGE_DEFAULTS = {
  characterSize: 256, // 標準の横幅(px)。slot5 のサイズ倍率がかかる
  seconds: 10, // 0 は無期限
  xMin: 20,
  xMax: 80,
  yMin: 100,
  yMax: 100,
  motion: 'fade',
  anchor: 'bottom',
} as const satisfies {
  characterSize: number
  seconds: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  motion: EnterMotionType
  anchor: StageAnchorType
}

type SlotValue = BotMessageSlotsType[keyof BotMessageSlotsType]

// slots の値は string / number / boolean のどれでも届く(editor・評価ブロックは文字列)。変換できなければ undefined
const toNumber = (v: SlotValue): number | undefined => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v.trim())
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

const toBoolean = (v: SlotValue): boolean => {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v === 1
  if (typeof v === 'string') return ['true', '1'].includes(v.trim().toLowerCase())
  return false
}

const clampPercent = (n: number) => Math.min(100, Math.max(0, n))

// モーション速度(秒)。EmotionAnimationEditor のアニメーション速度と同じ範囲
const DEFAULT_MOTION_DURATION = 1
const clampDuration = (n: number) => Math.min(5, Math.max(0.4, n))

// 最小 > 最大のときは入れ替える
const toRange = (min: number, max: number): [number, number] => (min <= max ? [min, max] : [max, min])

/**
 * slots を表示指定に変換する
 * - 不正値(NaN・範囲外など)・空は STAGE_DEFAULTS に落とす
 */
export const resolveStageSlots = (slots: BotMessageSlotsType | undefined): StageSpec => {
  const s = slots ?? {}
  const defaults = STAGE_DEFAULTS

  // 秒数
  const seconds = toNumber(s.slot0)
  const [xMin, xMax] = toRange(
    clampPercent(toNumber(s.slot1) ?? defaults.xMin),
    clampPercent(toNumber(s.slot2) ?? defaults.xMax)
  )
  const [yMin, yMax] = toRange(
    clampPercent(toNumber(s.slot3) ?? defaults.yMin),
    clampPercent(toNumber(s.slot4) ?? defaults.yMax)
  )
  const scale = toNumber(s.slot5)
  const anchorKey = typeof s.slot9 === 'string' ? s.slot9.trim() : ''
  const motionKey = typeof s.slot6 === 'string' ? s.slot6.trim() : ''
  const motionDuration = toNumber(s.slot8)

  return {
    seconds: seconds !== undefined && seconds >= 0 ? seconds : defaults.seconds,
    xMin,
    xMax,
    yMin,
    yMax,
    anchor: (stageAnchors as readonly string[]).includes(anchorKey) ? (anchorKey as StageAnchorType) : defaults.anchor,
    scale: scale !== undefined && scale > 0 ? scale : 1,
    motion: (enterMotions as readonly string[]).includes(motionKey) ? (motionKey as EnterMotionType) : defaults.motion,
    clearPrevious: toBoolean(s.slot7),
    motionDuration: motionDuration !== undefined ? clampDuration(motionDuration) : DEFAULT_MOTION_DURATION,
  }
}

/** 範囲内の値を 1 つ選ぶ(最小と最大が同じなら固定) */
export const pickInRange = (min: number, max: number, random: () => number = Math.random): number =>
  min === max ? min : min + random() * (max - min)
