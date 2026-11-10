// src/types/generator/scripts/BotMessageSlotMap.ts
import type { UiKind } from '@/types/OmikujiData'

// TODO:map は maps に移動

export type SlotName = `slot${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`

/** slotN が何を意味するか。editor の表示名・補足は i18n(uiSettings.slots.<UI名>.<キー>.title / .description) */
export type SlotMeta = {
  slot: SlotName
}

/**
 * 注意: スロット番号は保存データ・評価ブロックに残るため、並べ替え・詰め直しは禁止。
 * 追加は空き番号に、廃止は欠番のままにする。
 */

/** gameRanking */
export const RankingSlotMap = {
  gameKey: { slot: 'slot0' },
  listName: { slot: 'slot1' },
  symbol: { slot: 'slot2' },
  scoreText: { slot: 'slot3' },
  score: { slot: 'slot4' },
} as const satisfies Record<string, SlotMeta>
export type RankingSlotKey = keyof typeof RankingSlotMap

/** kujibikiPanel */
export const KujibikiSlotMap = {
  result: { slot: 'slot0' },
  detail: { slot: 'slot1' },
} as const satisfies Record<string, SlotMeta>

/**
 * characterStage(キャラ画像だけを表示する演出用 UI)
 * - 値は文字列で届く(editor・評価ブロック経由)ことがあるため、UI 側で number / boolean に変換する
 * - 空の slot は、既定値(resolveStageSlots の STAGE_DEFAULTS)にフォールバックする
 * - 位置は % (X は左端が 0、Y は上端が 0)。キャラ画像のどの点をその位置に置くかは anchor(slot9)で決める
 * - TODO: SlotMeta に型・範囲の情報がないため、editor では全 slot が文字列の入力欄になる(数値・boolean 用の入力欄は未対応)。
 *   不正値は UI 側(resolveStageSlots)で既定値に落としている。必要なら SlotMeta を拡張する
 */
export const CharacterStageSlotMap = {
  seconds: { slot: 'slot0' },
  xMin: {
    slot: 'slot1',
  },
  xMax: { slot: 'slot2' },
  yMin: { slot: 'slot3' },
  yMax: { slot: 'slot4' },
  scale: { slot: 'slot5' },
  motion: {
    slot: 'slot6',
  },
  clearPrevious: {
    slot: 'slot7',
  },
  motionDuration: {
    slot: 'slot8',
  },
  anchor: {
    slot: 'slot9',
  },
} as const satisfies Record<string, SlotMeta>
export type CharacterStageSlotKey = keyof typeof CharacterStageSlotMap

/**
 * UI ごとの「投稿メッセージの仕様」
 * - bubble: キャラ・本文(吹き出し)を使うか
 *     'comment' = キャラ + 本文 / 'character' = キャラだけ(本文は使わない) / false = 使わない
 *   空メッセージを弾くのは UI 側(useFilteredBotMessages など)の責務。エンジンは弾かない
 * - slots: slotN の意味 (editor の入力欄になる)
 * 全 UiKind 分を必須にする(UiKind を足したときの追加漏れはコンパイルエラーになる)。
 * 投稿を受け取らない UI は bubble: false かつ slots: {} (editor の UI 選択には出ない)。
 */
export type UiMessageSpec = { bubble: 'comment' | 'character' | false; slots: Record<string, SlotMeta> }

export const UiMessageSpecs = {
  characterStage: { bubble: 'character', slots: CharacterStageSlotMap },
  commentBubble: { bubble: 'comment', slots: {} },
  toastWidgets: { bubble: 'comment', slots: {} },
  liveClock: { bubble: 'comment', slots: {} }, // TODO: slots を使うなら map を足す
  kujibikiPanel: { bubble: 'comment', slots: KujibikiSlotMap },
  gameRanking: { bubble: false, slots: RankingSlotMap },
  userBoard: { bubble: false, slots: {} },
  cookieCounter: { bubble: false, slots: {} },
  streamCounter: { bubble: false, slots: {} },
  lifeHourglass: { bubble: false, slots: {} },
} as const satisfies Record<UiKind, UiMessageSpec>

export const getUiMessageSpec = (kind: UiKind): UiMessageSpec => UiMessageSpecs[kind]

/** 投稿を受け取れる UI か (editor の UI 選択に出すか) */
export const acceptsPost = (kind: UiKind): boolean => {
  const spec = getUiMessageSpec(kind)
  return !!spec.bubble || Object.keys(spec.slots).length > 0
}

export const postUiKinds = (Object.keys(UiMessageSpecs) as UiKind[]).filter(acceptsPost)
