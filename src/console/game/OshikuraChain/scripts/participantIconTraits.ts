// src/console/game/OshikuraChain/scripts/participantIconTraits.ts
// userId から、アイコン (コメントした人) の見た目を決める (純粋関数。同じ userId なら、いつも同じ見た目)
// ※ 乱数を引く順番を変えると、同じ userId でも見た目が変わる。項目を足すときは、末尾に足すこと
import { createRng, hashString } from './rng'

/**
 * アイコンの種類
 * - static: 動かない (基本。コメントした人のアイコン)
 * - boss: 2 分経過後の最初のユーザーが巨大化する (その分、並べると連鎖が増える)
 */
export type ParticipantIconKind = 'static' | 'boss'

export type ParticipantIconTraits = {
  kind: ParticipantIconKind
  /** 大きさ (倍率。占めるマスは、これを四捨五入した 1 辺) */
  baseSize: number
  /** 色 (0〜359) */
  hue: number
}

/** 巨大化したアイコンの性質 (大きい) */
export const BOSS_TRAITS = {
  baseSize: 2.2,
} as const

export const TRAIT_RANGES = {
  baseSize: [0.85, 1.15],
} as const satisfies Record<string, readonly [number, number]>

const lerp = ([min, max]: readonly [number, number], t: number): number => min + (max - min) * t

export const getParticipantIconTraits = (userId: string): ParticipantIconTraits => {
  const rng = createRng(hashString(userId))
  // 以前の項目 (種類・動く間隔など) を引いていた順番のまま、使う項目だけを読む (大きさ・色が変わらないように)
  rng()
  rng()
  const sizeRoll = rng()
  rng()
  rng()
  const hueRoll = rng()
  return {
    kind: 'static',
    baseSize: lerp(TRAIT_RANGES.baseSize, sizeRoll),
    hue: Math.floor(hueRoll * 360),
  }
}

/** 巨大化したアイコンの性質。見た目の色だけ、userId で決まる */
export const getGiantIconTraits = (userId: string): ParticipantIconTraits => ({
  ...getParticipantIconTraits(userId),
  kind: 'boss',
  baseSize: BOSS_TRAITS.baseSize,
})
