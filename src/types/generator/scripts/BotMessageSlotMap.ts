// src/types/generator/scripts/BotMessageSlotMap.ts
import type { UiKind } from '@/types/OmikujiData'

export type SlotName = `slot${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`

/** slotN が何を意味するか。editor の表示にも使う */
export type SlotMeta = {
  slot: SlotName
  title: string // editor の表示名
  description: string // editor の補足
}

/**
 * 注意: スロット番号は保存データ・評価ブロックに残るため、並べ替え・詰め直しは禁止。
 * 追加は空き番号に、廃止は欠番のままにする。
 */

/** gameRanking */
export const RankingSlotMap = {
  gameKey: { slot: 'slot0', title: 'ゲームキー', description: 'ゲームの認識キー(任意)' },
  listName: { slot: 'slot1', title: 'ユーザー名', description: '表示名。空なら user.userName を使う' },
  symbol: { slot: 'slot2', title: 'シンボル', description: 'ユーザー名の右側につく記号' },
  label: { slot: 'slot3', title: '得点(文字)', description: '表示用の得点' },
  score: { slot: 'slot4', title: '得点(数値)', description: '並び順を決める(表示しない)' },
} as const satisfies Record<string, SlotMeta>
export type RankingSlotKey = keyof typeof RankingSlotMap

/** kujibikiPanel */
export const KujibikiSlotMap = {
  result: { slot: 'slot0', title: '結果', description: '運勢などの見出し(例: 大吉)' },
  detail: { slot: 'slot1', title: '解説', description: '結果の解説文' },
} as const satisfies Record<string, SlotMeta>

/**
 * characterStage(キャラ画像だけを表示する演出用 UI)
 * - 値は文字列で届く(editor・評価ブロック経由)ことがあるため、UI 側で number / boolean に変換する
 * - 空の slot は、UI 設定(CharacterStageSchema)の既定値にフォールバックする
 * - 位置は % 。X はキャラの中心、Y は下辺が基準(Y は画面上端が 0、下端が 100)
 * - slot8, slot9 は空き
 * - TODO: SlotMeta に型・範囲の情報がないため、editor では全 slot が文字列の入力欄になる(数値・boolean 用の入力欄は未対応)。
 *   不正値は UI 側(resolveStageSlots)で既定値に落としている。必要なら SlotMeta を拡張する
 */
export const CharacterStageSlotMap = {
  seconds: { slot: 'slot0', title: '表示秒数', description: '0 は無期限。空なら UI 設定の既定値' },
  xMin: { slot: 'slot1', title: '位置X 最小', description: '0〜100(%)。最小と最大が同じなら固定、違えば範囲内でランダム' },
  xMax: { slot: 'slot2', title: '位置X 最大', description: '0〜100(%)' },
  yMin: { slot: 'slot3', title: '位置Y 最小', description: '0〜100(%)。画面上端が 0。キャラの下辺が基準' },
  yMax: { slot: 'slot4', title: '位置Y 最大', description: '0〜100(%)' },
  scale: { slot: 'slot5', title: 'サイズ倍率', description: '1 が標準。空なら 1' },
  motion: { slot: 'slot6', title: '登場・退場モーション', description: 'モーションのキー(例: fade, slideUp)。空なら UI 設定の既定値' },
  clearPrevious: { slot: 'slot7', title: '前の表示を消す', description: 'true なら、これまでの表示を消してから表示する' },
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
} as const satisfies Record<UiKind, UiMessageSpec>

export const getUiMessageSpec = (kind: UiKind): UiMessageSpec => UiMessageSpecs[kind]

/** 投稿を受け取れる UI か (editor の UI 選択に出すか) */
export const acceptsPost = (kind: UiKind): boolean => {
  const spec = getUiMessageSpec(kind)
  return !!spec.bubble || Object.keys(spec.slots).length > 0
}

export const postUiKinds = (Object.keys(UiMessageSpecs) as UiKind[]).filter(acceptsPost)
