// src/console/game/WordAlchemy/scripts/codex.ts
// 図鑑のデータと更新 (純粋関数)。図鑑は鍋ごとに持ち、キーは「鍋 + 変わらないアイテム ID」(名前ではない)。
// 1 つの枠には、名前・素材元 (材料のことばと、出した視聴者名)・発見日時だけを持つ (回数・履歴は持たない)
import { z } from 'zod'
import type { ItemDefinition } from '../maps/WordAlchemyItemMap'

/** 保存先 (game-configs/<gameKey>.json)。GameConfigKeySchema (英字で始まる英数字) に合う */
export const CODEX_GAME_KEY = 'wordAlchemyCodex'
/** 保存データのバージョン。合わない・壊れているときは、既存のデータを捨てて初期化する (マイグレーションはしない) */
export const CODEX_DATA_VERSION = 2

/** 素材元: 鍋に入れたことばと、それを出した視聴者名 */
const MaterialSchema = z.object({ text: z.string(), userName: z.string() })
const EntrySchema = z.object({
  /** 完成品の名前 (アイコンの種にもなる) */
  name: z.string(),
  /** 素材元 (鍋に入れた順) */
  materials: z.array(MaterialSchema),
  /** 発見日時 (ms) */
  at: z.number(),
})
export const CodexSchema = z.object({
  dataVersion: z.literal(CODEX_DATA_VERSION),
  /** 鍋ごとの図鑑 (鍋の種類 → アイテム ID → 枠)。1 つの枠には 1 件だけ入る */
  pots: z.record(z.string(), z.record(z.string(), EntrySchema)),
})

export type Codex = z.infer<typeof CodexSchema>
export type CodexEntry = z.infer<typeof EntrySchema>
export type CodexMaterial = z.infer<typeof MaterialSchema>

export const createEmptyCodex = (): Codex => ({ dataVersion: CODEX_DATA_VERSION, pots: {} })

/** 保存データを読む。まだない (null) なら初期状態。バージョン違い・破損なら、初期状態にして discarded を立てる */
export const parseCodex = (raw: unknown): { codex: Codex; discarded: boolean } => {
  if (raw === null || raw === undefined) return { codex: createEmptyCodex(), discarded: false }
  const parsed = CodexSchema.safeParse(raw)
  return parsed.success ? { codex: parsed.data, discarded: false } : { codex: createEmptyCodex(), discarded: true }
}

/** その鍋の図鑑の、その枠 (なければ undefined) */
export const getEntry = (codex: Codex, pot: string, itemId: string): CodexEntry | undefined => codex.pots[pot]?.[itemId]

/** その鍋の図鑑の枠に入れる (空なら新規、あれば置き換え)。元の図鑑は書き換えない */
export const setEntry = (codex: Codex, pot: string, itemId: string, entry: CodexEntry): Codex => ({
  ...codex,
  pots: { ...codex.pots, [pot]: { ...codex.pots[pot], [itemId]: entry } },
})

/** その鍋で発見したアイテムの数 (分母は、登録されているアイテム数。一覧にないアイテムの記録は数えない) */
export const countDiscovered = (codex: Codex, pot: string, items: readonly ItemDefinition[]): number =>
  items.filter((item) => getEntry(codex, pot, item.id)).length
