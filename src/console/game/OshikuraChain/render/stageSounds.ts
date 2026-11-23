// src/console/game/OshikuraChain/render/stageSounds.ts
// 効果音の一覧。素材は assets/sounds/<四半期>/NuisanceSurvival/ に置く (配布後は sounds/NuisanceSurvival/)。
// ファイル名を変えるときは、ここだけを変える。ファイルがなくても、その音が鳴らないだけでゲームは動く
export type SoundKey = 'land' | 'bossLand' | 'explosion' | 'remove' | 'wordBlast'

/** sounds/ からの相対フォルダ */
export const SOUND_FOLDER = 'NuisanceSurvival/'

export const SOUND_FILES: Record<SoundKey, { file: string; volume: number }> = {
  /** 邪魔者の着地 */
  land: { file: 'cute.mp3', volume: 0.6 },
  /** ボスの着地 */
  bossLand: { file: 'explosion.mp3', volume: 0.9 },
  /** 爆発して消えた */
  explosion: { file: 'explosion.mp3', volume: 0.9 },
  /** 主人公が取り除いた (アイコン・ことばが、画面の外へ出た) */
  remove: { file: 'explosion.mp3', volume: 0.6 },
  /** ことばの爆発 (explosion.mp3 とは別の音。素材がなければ、ブラウザの音で代わりに鳴らす) */
  wordBlast: { file: 'explosion.mp3', volume: 0.9 },
}

/** 同じ音を同時に鳴らせる数 (コメントが一気に届いたとき、音が重なって割れないようにする) */
export const MAX_CONCURRENT_PER_SOUND = 3
