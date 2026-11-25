// src/console/game/WordAlchemy/render/stageSounds.ts
// 効果音の一覧。素材は assets/sounds/core/ のものだけを使う (配布後は sounds/core/)。
// ファイル名を変えるときは、ここだけを変える。ファイルがなくても、その音が鳴らないだけでゲームは動く
export type SoundKey = 'land' | 'intake' | 'reject' | 'remove' | 'brewStart' | 'discoverNew' | 'discoverKnown' | 'lost'

export const SOUND_FILES: Record<SoundKey, { file: string; volume: number }> = {
  /** ことばが降ってきた (1 コメントにつき 1 回) */
  land: { file: 'cute.mp3', volume: 0.35 },
  /** ことばが鍋に入った */
  intake: { file: 'bubble.mp3', volume: 0.7 },
  /** 鍋が、ことばを受け付けずに投げ飛ばした */
  reject: { file: 'cancel.mp3', volume: 0.6 },
  /** ことばが縁に押し込まれて消えた */
  remove: { file: 'bounce.mp3', volume: 0.5 },
  /** 煮込みが始まった */
  brewStart: { file: 'decision.mp3', volume: 0.7 },
  /** 新種を発見した */
  discoverNew: { file: 'fanfare.mp3', volume: 0.9 },
  /** 既発見のアイテムができた */
  discoverKnown: { file: 'collect.mp3', volume: 0.7 },
  /** 抽選エラー (アイテムが消えてしまった) */
  lost: { file: 'negative.mp3', volume: 0.7 },
}

/** 同じ音を同時に鳴らせる数 (ことばが一気に届いたとき、音が重なって割れないようにする) */
export const MAX_CONCURRENT_PER_SOUND = 3
