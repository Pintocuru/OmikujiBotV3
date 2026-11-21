// src/console/game/NuisanceSurvival/scripts/nuisanceTraits.ts
// userId から、邪魔者の性質を決める (純粋関数。同じ userId なら、いつも同じ性質)
// ※ 乱数を引く順番を変えると、同じ userId でも性質が変わる。項目を足すときは、末尾に足すこと
import { createRng, hashString } from './rng'

/**
 * 邪魔者の種類
 * 基本は static (動かない)。特殊能力を持つ邪魔者だけが、次のどれかになる
 * - static: 動かない (基本)
 * - wanderer: ランダムに歩く
 * - evader: 主人公から逃げる (壁際に追い込むと捕まえやすい)
 * - creeper: 主人公に近づく (すりよる)
 * - bouncer: まっすぐ進み、壁で跳ね返る
 * - bomber: 動かず、時間が来ると爆発して消える (その代わり、大きなダメージを与える)
 * - boss: lc がキリ番のコメントで出る。大きく、主人公に近づき、時間が来ると爆発して消える
 */
export type NuisanceKind = 'static' | 'wanderer' | 'evader' | 'creeper' | 'bouncer' | 'bomber' | 'boss'

/** 動く種類 (エンジンはこれだけを動かす) */
export const MOVING_KINDS: readonly NuisanceKind[] = ['wanderer', 'evader', 'creeper', 'bouncer', 'boss']

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
  /** 特殊能力の抽選値 (0〜1)。コンフィグの割合より小さければ、特殊能力を持つ */
  specialRoll: number
  /** 爆発までの秒数 (bomber 以外は null) */
  fuseSeconds: number | null
  /** 爆発のダメージ (bomber 以外は 0。大きさの倍率が掛かる) */
  explosionDamage: number
}

/** 特殊能力の内訳 (合計 1)。特殊能力を持つと決まった邪魔者が、この割合でどれかになる */
export const SPECIAL_KIND_WEIGHTS: readonly (readonly [NuisanceKind, number])[] = [
  ['wanderer', 0.3],
  ['evader', 0.2],
  ['creeper', 0.2],
  ['bouncer', 0.15],
  ['bomber', 0.15],
]

/** 種類ごとの、1マス動く間隔 (秒) の範囲 */
const MOVE_INTERVAL_RANGE: Record<NuisanceKind, readonly [number, number]> = {
  static: [1, 1], // 動かないので、使われない
  // 特殊能力は、狙いやすいように遅め (にげるは、とくに遅い)。ボスは、以前の速さのまま
  wanderer: [0.9, 1.8],
  evader: [1.0, 2.0],
  creeper: [0.9, 1.7],
  bouncer: [0.45, 1.0],
  bomber: [1, 1], // 動かないので、使われない
  boss: [0.6, 0.9],
}

/** ボスの性質 (大きく、重く、取り除きにくい。毎秒のダメージも大きい) */
export const BOSS_TRAITS = {
  baseSize: 2.2,
  drainPerSecond: 1,
  pushSeconds: 3,
  fuseSeconds: 30,
  explosionDamage: 12,
} as const

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

const pickSpecialKind = (roll: number): NuisanceKind => {
  let acc = 0
  for (const [kind, weight] of SPECIAL_KIND_WEIGHTS) {
    acc += weight
    if (roll < acc) return kind
  }
  return SPECIAL_KIND_WEIGHTS[SPECIAL_KIND_WEIGHTS.length - 1][0]
}

/**
 * specialRate: 特殊能力を持つ割合 (0〜1)。省略すると、全員が特殊能力を持つ
 * 抽選値は userId で決まるので、割合を上げると特殊能力持ちが増えるだけで、すでに持っている人は変わらない
 */
/** ボスの性質。見た目の色だけ、userId で決まる */
export const getBossTraits = (userId: string): NuisanceTraits => ({
  ...getNuisanceTraits(userId, 0),
  kind: 'boss',
  moveIntervalSeconds: lerp(MOVE_INTERVAL_RANGE.boss, createRng(hashString(userId))()),
  baseSize: BOSS_TRAITS.baseSize,
  drainPerSecond: BOSS_TRAITS.drainPerSecond,
  pushSeconds: BOSS_TRAITS.pushSeconds,
  fuseSeconds: BOSS_TRAITS.fuseSeconds,
  explosionDamage: BOSS_TRAITS.explosionDamage,
})

export const getNuisanceTraits = (userId: string, specialRate = 1): NuisanceTraits => {
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
  const specialRoll = rng() // 乱数は、末尾に足した (既存の項目の値を変えないため)

  const kind: NuisanceKind = specialRoll < specialRate ? pickSpecialKind(kindRoll) : 'static'
  const isBomber = kind === 'bomber'
  return {
    kind,
    moveIntervalSeconds: lerp(MOVE_INTERVAL_RANGE[kind], moveRoll),
    baseSize: lerp(TRAIT_RANGES.baseSize, sizeRoll),
    drainPerSecond: lerp(isBomber ? TRAIT_RANGES.bomberDrainPerSecond : TRAIT_RANGES.drainPerSecond, drainRoll),
    pushSeconds: lerp(TRAIT_RANGES.pushSeconds, pushRoll),
    hue: Math.floor(hueRoll * 360),
    specialRoll,
    fuseSeconds: isBomber ? lerp(TRAIT_RANGES.fuseSeconds, fuseRoll) : null,
    explosionDamage: isBomber ? lerp(TRAIT_RANGES.explosionDamage, blastRoll) : 0,
  }
}
