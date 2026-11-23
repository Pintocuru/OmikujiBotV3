// src/console/game/OshikuraChain/render/stageSounds.ts
// 効果音の一覧。素材は assets/sounds/core/ か assets/sounds/core_more/ のものだけを使う (配布後は sounds/core/ ・ sounds/core_more/)。
// ファイル名を変えるときは、ここだけを変える。ファイルがなくても、その音が鳴らないだけでゲームは動く
export type SoundKey =
  | 'land'
  | 'bossLand'
  | 'explosion'
  | 'remove'
  | 'wordBlast'
  | 'bigChain'
  | 'heatUp'
  | 'gameOver'
  | 'timeAttackClear'
  | 'gift'

/** sounds/ からの相対フォルダ */
export type SoundFolder = 'core' | 'core_more'

export const SOUND_FILES: Record<SoundKey, { file: string; volume: number }> = {
  /** 邪魔者の着地 */
  land: { file: 'cute.mp3', volume: 0.6 },
  /** ボスの着地 */
  bossLand: { file: 'explosion.mp3', volume: 0.9 },
  /** 爆発して消えた */
  explosion: { file: 'explosion.mp3', volume: 0.9 },
  /** 主人公が取り除いた (アイコン・ことばが、画面の外へ出た) */
  remove: { file: 'explosion.mp3', volume: 0.6 },
  /** ことばの爆発 (素材がなければ、ブラウザの音で代わりに鳴らす) */
  wordBlast: { file: 'explosion.mp3', volume: 0.9 },
  /** 大連鎖の祝い (連鎖が BIG_CHAIN_MIN 以上で終わったとき) */
  bigChain: { file: 'applause.mp3', volume: 0.8 },
  /** 倍率 (ヒート) の段階が上がった */
  heatUp: { file: 'collect.mp3', volume: 0.7 },
  /** ゲームオーバー (耐久で、残り時間が 0 になったとき) */
  gameOver: { file: 'fail.mp3', volume: 0.8 },
  /** タイムアタックをクリアした */
  timeAttackClear: { file: 'applause.mp3', volume: 0.8 },
  /** ギフトを受け取った */
  gift: { file: 'cash.mp3', volume: 0.8 },
}

/** 同じ音を同時に鳴らせる数 (コメントが一気に届いたとき、音が重なって割れないようにする) */
export const MAX_CONCURRENT_PER_SOUND = 3
