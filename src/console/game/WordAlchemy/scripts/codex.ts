// src/console/game/WordAlchemy/scripts/codex.ts
// 図鑑のデータと更新 (純粋関数)。図鑑のキーは名前ではなく、変わらないアイテム ID
import { z } from 'zod'
import type { ItemDefinition } from '../maps/WordAlchemyItemMap'

/** 保存先 (game-configs/<gameKey>.json)。GameConfigKeySchema (英字で始まる英数字) に合う */
export const CODEX_GAME_KEY = 'wordAlchemyCodex'
/** 保存データのバージョン。合わない・壊れているときは、既存のデータを捨てて初期化する (マイグレーションはしない) */
export const CODEX_DATA_VERSION = 1
/** 残す名前の履歴の件数 (初回の名前とは別に、直近のもの) */
export const CODEX_NAME_HISTORY_MAX = 5
/** 残す発見履歴の件数 (これを超えると、古いものから捨てる。図鑑ファイルが育ちすぎないようにする) */
export const CODEX_HISTORY_MAX = 500

const EntrySchema = z.object({
  /** 初回に発見したときの名前 */
  firstName: z.string(),
  /** 直近の名前の履歴 (古い順。最後が最新。CODEX_NAME_HISTORY_MAX 件まで) */
  names: z.array(z.string()),
})
const DiscoverySchema = z.object({
  itemId: z.string(),
  /** 発見日時 (ms) */
  at: z.number(),
  /** 材料を出した視聴者名 (重複なし) */
  userNames: z.array(z.string()),
  /** 鍋の種類 */
  pot: z.string(),
})
export const CodexSchema = z.object({
  dataVersion: z.literal(CODEX_DATA_VERSION),
  /** 発見したアイテム (キーはアイテム ID。再発見しても 1 件) */
  entries: z.record(z.string(), EntrySchema),
  /** 発見履歴 (再発見も含める。直近 CODEX_HISTORY_MAX 件まで。古いものから捨てる) */
  history: z.array(DiscoverySchema),
})

export type Codex = z.infer<typeof CodexSchema>
export type CodexEntry = z.infer<typeof EntrySchema>
export type Discovery = z.infer<typeof DiscoverySchema>

export const createEmptyCodex = (): Codex => ({ dataVersion: CODEX_DATA_VERSION, entries: {}, history: [] })

/** 保存データを読む。まだない (null) なら初期状態。バージョン違い・破損なら、初期状態にして discarded を立てる */
export const parseCodex = (raw: unknown): { codex: Codex; discarded: boolean } => {
  if (raw === null || raw === undefined) return { codex: createEmptyCodex(), discarded: false }
  const parsed = CodexSchema.safeParse(raw)
  return parsed.success ? { codex: parsed.data, discarded: false } : { codex: createEmptyCodex(), discarded: true }
}

/**
 * 発見を記録する。初めてのアイテムなら isNew (新種)。
 * 図鑑本体は 1 件のまま、名前の履歴 (直近 5 件) と発見履歴 (直近 500 件) を更新する
 */
export const recordDiscovery = (
  codex: Codex,
  found: { itemId: string; name: string; at: number; userNames: readonly string[]; pot: string }
): { codex: Codex; isNew: boolean } => {
  const current = codex.entries[found.itemId]
  const entry: CodexEntry = current
    ? { ...current, names: [...current.names, found.name].slice(-CODEX_NAME_HISTORY_MAX) }
    : { firstName: found.name, names: [found.name] }
  return {
    isNew: !current,
    codex: {
      ...codex,
      entries: { ...codex.entries, [found.itemId]: entry },
      history: [
        ...codex.history,
        { itemId: found.itemId, at: found.at, userNames: [...new Set(found.userNames)], pot: found.pot },
      ].slice(-CODEX_HISTORY_MAX),
    },
  }
}

/** 発見したアイテムの数 (分母は、登録されているアイテム数。一覧にないアイテムの記録は数えない) */
export const countDiscovered = (codex: Codex, items: readonly ItemDefinition[]): number =>
  items.filter((item) => item.id in codex.entries).length

/** そのアイテムを発見した回数 (再発見を含む) */
export const countFinds = (codex: Codex, itemId: string): number =>
  codex.history.filter((d) => d.itemId === itemId).length
