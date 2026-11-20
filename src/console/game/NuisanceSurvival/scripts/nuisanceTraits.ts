// src/console/game/NuisanceSurvival/scripts/nuisanceTraits.ts
// userId から、邪魔者の性質を決める (純粋関数。同じ userId なら、いつも同じ性質)
// ※ 乱数を引く順番を変えると、同じ userId でも性質が変わる。項目を足すときは、末尾に足すこと
import { createRng, hashString } from './rng'

/**
 * 邪魔者の種類
 * - wanderer: ランダムに歩く
 * - evader: 主人公から逃げる (壁際に追い込むと捕まえやすい)
 * - bouncer: まっすぐ進み、壁で跳ね返る
 * - bomber: ゆっくり歩き、時間が来ると爆発して消える (その代わり、大きなダメージを与える)
 */
export type NuisanceKind = 'wanderer' | 'evader' | 'bouncer' | 'bomber'

export type NuisanceTraits = {
  kind: NuisanceKind
  /** 1マス動く間隔 (秒) */
  moveIntervalSeconds: number
  /** 生まれたときの大きさ (倍率) */
  baseSize: number
  /** 1秒あたりに減らすライフ (大きさの倍率が掛かる) */
  drainPerSecond: number
  /** 押して取り除くのに必要な時間 (秒。大きさの倍率が掛かる) */
  pushSeconds: number
  /** 色 (0〜359) */
  hue: number
  /** 爆発までの秒数 (bomber 以外は null) */
  fuseSeconds: number | null
  /** 爆発のダメージ (bomber 以外は 0。大きさの倍率が掛かる) */
  explosionDamage: number
}

/** 種類の出やすさ (合計 1) */
export const KIND_WEIGHTS: readonly (readonly [NuisanceKind, number])[] = [
  ['wanderer', 0.4],
  ['evader', 0.2],
  ['bouncer', 0.2],
  ['bomber', 0.2],
]

/** 種類ごとの、1マス動く間隔 (秒) の範囲 */
const MOVE_INTERVAL_RANGE: Record<NuisanceKind, readonly [number, number]> = {
  wanderer: [0.6, 1.2],
  evader: [0.5, 1.0],
  bouncer: [0.3, 0.7],
  bomber: [0.9, 1.6],
}

export const TRAIT_RANGES = {
  baseSize: [0.85, 1.15],
  drainPerSecond: [0.25, 0.75],
  /** bomber は、毎秒のダメージが小さい (代わりに爆発する) */
  bomberDrainPerSecond: [0.1, 0.3],
  pushSeconds: [0.5, 1.2],
  fuseSeconds: [12, 25],
  explosionDamage: [8, 16],
} as const satisfies Record<string, readonly [number, number]>

const lerp = ([min, max]: readonly [number, number], t: number): number => min + (max - min) * t

const pickKind = (roll: number): NuisanceKind => {
  let acc = 0
  for (const [kind, weight] of KIND_WEIGHTS) {
    acc += weight
    if (roll < acc) return kind
  }
  return KIND_WEIGHTS[KIND_WEIGHTS.length - 1][0]
}

export const getNuisanceTraits = (userId: string): NuisanceTraits => {
  const rng = createRng(hashString(userId))
  // 種類にかかわらず、同じ順番で全項目を引く (種類ごとに使わない項目があっても、他の項目の値が変わらないように)
  const kindRoll = rng()
  const moveRoll = rng()
  const sizeRoll = rng()
  const drainRoll = rng()
  const pushRoll = rng()
  const hueRoll = rng()
  const fuseRoll = rng()
  const blastRoll = rng()

  const kind = pickKind(kindRoll)
  const isBomber = kind === 'bomber'
  return {
    kind,
    moveIntervalSeconds: lerp(MOVE_INTERVAL_RANGE[kind], moveRoll),
    baseSize: lerp(TRAIT_RANGES.baseSize, sizeRoll),
    drainPerSecond: lerp(isBomber ? TRAIT_RANGES.bomberDrainPerSecond : TRAIT_RANGES.drainPerSecond, drainRoll),
    pushSeconds: lerp(TRAIT_RANGES.pushSeconds, pushRoll),
    hue: Math.floor(hueRoll * 360),
    fuseSeconds: isBomber ? lerp(TRAIT_RANGES.fuseSeconds, fuseRoll) : null,
    explosionDamage: isBomber ? lerp(TRAIT_RANGES.explosionDamage, blastRoll) : 0,
  }
}
