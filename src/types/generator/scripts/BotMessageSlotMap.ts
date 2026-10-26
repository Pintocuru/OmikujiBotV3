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

// slots を使わない UI は {} にする(null にしない。editor が分岐しなくて済む)
const NO_SLOTS = {} as const satisfies Record<string, SlotMeta>

/**
 * 全 UiKind 分を必須にする(UiKind を足したときの追加漏れはコンパイルエラーになる)
 * TODO: slots を使う UI が増えたら、ここに対応する map を足す。
 */
export const UiSlotMaps = {
  commentBubble: NO_SLOTS,
  gameRanking: RankingSlotMap,
  cookieCounter: NO_SLOTS,
  kujibikiPanel: KujibikiSlotMap,
  liveClock: NO_SLOTS,
  streamCounter: NO_SLOTS,
  toastWidgets: NO_SLOTS,
  userBoard: NO_SLOTS,
} as const satisfies Record<UiKind, Record<string, SlotMeta>>
