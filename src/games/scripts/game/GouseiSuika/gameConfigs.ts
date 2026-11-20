// src/games/scripts/game/GouseiSuika/gameConfigs.ts
import { ScenarioStepWordPartyType } from '@/types/OmikujiData'

/**
 * 型定義
 */
// 各ゲーム（例: suika）がキー
export type GameConfigs = Record<string, GameConfigDetails>

export type GameConfigDetails = {
  small: GameConfigItem[] // small ゲーム設定の配列
  big: GameConfigItem[] // big ゲーム設定の配列
}

export type GameConfigItem = {
  chance: number // 確率
  times?: number // オプショナル: 繰り返し回数
  points: number // ポイント
  damage?: number // オプショナル: ダメージ
  partyId: string // WordParty で出すID
}

export interface GameResult {
  points: number
  postArray: ScenarioStepWordPartyType[]
}

// ゲーム関連の定数
export const GAME_CONSTANTS = {
  SCORE_MULTIPLIER: { MIN: 1, MAX: 1 },
  INITIAL_LIFE: 3,
  EMOJI_DELAY: 1,
  HALF_DIVISOR: 2,
} as const

// ---

/**
 * 設定値
 */

export const GAME_CONFIGS: GameConfigs = {
  // スイカゲーム
  スイカ: {
    small: [
      { chance: 67, times: 15, points: 1, partyId: 'berryABm' }, // いちご：1点
      { chance: 50, times: 15, points: 3, partyId: 'Grape1Be' }, // ぶどう：3点
      { chance: 50, times: 10, points: 10, partyId: 'Dekopon6' }, // デコポン：10点
      { chance: 50, times: 8, points: 20, partyId: 'Persimmo' }, // かき：20点
      { chance: 67, times: 5, points: 50, partyId: 'ApplekcL' }, // りんご：50点
    ],
    big: [
      { chance: 25, points: 300, damage: 1, partyId: 'PeartFgh' }, // なし
      { chance: 25, points: 400, damage: 1, partyId: 'Pineappl' }, // パイナップル
      { chance: 33, points: 500, damage: 2, partyId: 'PeachLbe' }, // もも
      { chance: 33, points: 700, damage: 2, partyId: 'MelonDNo' }, // メロン
      { chance: 50, points: 1000, damage: 3, partyId: 'Watermel' }, // スイカ
      { chance: 100, points: 1000, damage: -3, partyId: 'Watermel' }, // ダブル
    ],
  },

  // カボチャゲーム
  カボチャ: {
    small: [
      { chance: 67, times: 15, points: 1, partyId: 'berryABm' }, // いちご strawberry
      { chance: 50, times: 15, points: 3, partyId: 'Grape1Be' }, // ぶどう grape
      { chance: 50, times: 10, points: 10, partyId: 'Dekopon6' }, // デコポン dekopon
      { chance: 50, times: 8, points: 20, partyId: 'Persimmo' }, // かき persimmon
      { chance: 67, times: 5, points: 50, partyId: 'ApplekcL' }, // りんご apple
    ],
    big: [
      { chance: 33, points: 200, damage: 0, partyId: 'Candyvqq' }, // キャンディー candy
      { chance: 33, points: 300, damage: 1, partyId: 'PeartFgh' }, // なし pear
      { chance: 33, points: 400, damage: 1, partyId: 'Pineappl' }, // パイナップル pineapple
      { chance: 33, points: 500, damage: 2, partyId: 'PeachLbe' }, // もも peach
      { chance: 33, points: 700, damage: 2, partyId: 'MelonDNo' }, // メロン melon
      { chance: 50, points: 1000, damage: 3, partyId: 'Watermel' }, // スイカ watermelon
      { chance: 100, points: 1000, damage: -3, partyId: 'Pumpkinj' }, // カボチャ pumpkin
    ],
  },

  // クジラゲーム
  クジラ: {
    small: [
      { chance: 50, times: 5, points: 11, partyId: 'Clownfish' }, // クマノミ
      { chance: 50, times: 5, points: 22, partyId: 'Jellyfis' }, // クラゲ
      { chance: 50, times: 5, points: 33, partyId: 'Pufferfi' }, // フグ
      { chance: 50, times: 5, points: 44, partyId: 'CrabI78W' }, // カニ
      { chance: 50, times: 5, points: 55, partyId: 'TunapGIR' }, // ご期待ください
    ],
    big: [
      { chance: 20, points: 0, damage: 3, partyId: 'OrcazXcx' }, // シャチ
      { chance: 25, points: 200, damage: 0, partyId: 'TurtleDZ' }, // カメ
      { chance: 25, points: 250, damage: 0, partyId: 'Sunfishl' }, // マンボウ
      { chance: 25, points: 300, damage: 0, partyId: 'SharkpBa' }, // サメ
      { chance: 100, points: 500, damage: 0, partyId: 'Whalefep' }, // クジラ
    ],
  },
}
