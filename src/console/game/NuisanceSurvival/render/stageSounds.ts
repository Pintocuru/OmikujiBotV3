// src/console/game/NuisanceSurvival/render/stageSounds.ts
// 効果音の一覧。素材は assets/sounds/<四半期>/NuisanceSurvival/ に置く (配布後は sounds/NuisanceSurvival/)。
// ファイル名を変えるときは、ここだけを変える。ファイルがなくても、その音が鳴らないだけでゲームは動く
export type SoundKey = 'land' | 'bossLand' | 'explode' | 'remove'

/** sounds/ からの相対フォルダ */
export const SOUND_FOLDER = 'NuisanceSurvival/'

export const SOUND_FILES: Record<SoundKey, { file: string; volume: number }> = {
  /** 邪魔者の着地 */
  land: { file: 'land.mp3', volume: 0.6 },
  /** ボスの着地 */
  bossLand: { file: 'boss-land.mp3', volume: 0.9 },
  /** 爆発して消えた */
  explode: { file: 'explode.mp3', volume: 0.9 },
  /** 主人公が取り除いた */
  remove: { file: 'remove.mp3', volume: 0.6 },
}

/** 同じ音を同時に鳴らせる数 (コメントが一気に届いたとき、音が重なって割れないようにする) */
export const MAX_CONCURRENT_PER_SOUND = 3
