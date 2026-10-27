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
 * UI ごとの「投稿メッセージの仕様」
 * - bubble: キャラ・本文(吹き出し)を使うか
 * - slots: slotN の意味 (editor の入力欄になる)
 * 全 UiKind 分を必須にする(UiKind を足したときの追加漏れはコンパイルエラーになる)。
 * 投稿を受け取らない UI は bubble: false かつ slots: {} (editor の UI 選択には出ない)。
 */
export type UiMessageSpec = { bubble: boolean; slots: Record<string, SlotMeta> }

export const UiMessageSpecs = {
  commentBubble: { bubble: true, slots: {} },
  toastWidgets: { bubble: true, slots: {} },
  liveClock: { bubble: true, slots: {} }, // TODO: slots を使うなら map を足す
  kujibikiPanel: { bubble: true, slots: KujibikiSlotMap },
  gameRanking: { bubble: false, slots: RankingSlotMap },
  userBoard: { bubble: false, slots: {} },
  cookieCounter: { bubble: false, slots: {} },
  streamCounter: { bubble: false, slots: {} },
} as const satisfies Record<UiKind, UiMessageSpec>

export const getUiMessageSpec = (kind: UiKind): UiMessageSpec => UiMessageSpecs[kind]

/** 投稿を受け取れる UI か (editor の UI 選択に出すか) */
export const acceptsPost = (kind: UiKind): boolean => {
  const spec = getUiMessageSpec(kind)
  return spec.bubble || Object.keys(spec.slots).length > 0
}

export const postUiKinds = (Object.keys(UiMessageSpecs) as UiKind[]).filter(acceptsPost)
