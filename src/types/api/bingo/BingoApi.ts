// src/types/api/bingo/BingoApi.ts
import { z } from 'zod'

/**
 * ライバービンゴの LiveConsole ⇔ OBS のやり取り
 *
 * カードの状態と操作は OBS 側(ブラウザソース)が持つ。サーバーは次の 2 つを預かるだけの「伝言板」。
 * - 命令の列: LiveConsole が積み、OBS が 0.5 秒ごとに since 付きで取りに来る
 * - カードの写し: OBS が変化のたびに送り、LiveConsole が表示のために取りに行く
 * 保存はしない(サーバーを再起動したら空に戻る)。
 */

const cellIndex = z.number().int().min(0).max(99)

/** 数値表示の単位(LiverBingoItemSchema.unit と同じ) */
const unitSchema = z.union([z.literal(1), z.literal(10), z.literal(100), z.literal(1000)])

/** マスの書き換え(指定した項目だけ変える) */
export const LiverBingoCellPatchSchema = z.object({
  title: z.string().max(200).optional(),
  target: z.number().min(0).max(1_000_000).optional(),
  unit: unitSchema.optional(),
})
export type LiverBingoCellPatchType = z.infer<typeof LiverBingoCellPatchSchema>

/**
 * LiveConsole から OBS への命令
 * - increment / decrement: 進捗 +1 / -1(OBS 上のクリックと同じ。decrement は進捗 0 で固定項目でなければお題を入れ替える)
 * - reroll: お題を入れ替える(進捗は 0 に戻す)
 * - setCell: お題・目標・単位を書き換える(進捗はそのまま)
 * - focus: 注目するマスを光らせる(null で解除)
 * - reset: カードを作り直す
 */
export const LiverBingoCommandSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('increment'), index: cellIndex }),
  z.object({ type: z.literal('decrement'), index: cellIndex }),
  z.object({ type: z.literal('reroll'), index: cellIndex }),
  z.object({ type: z.literal('setCell'), index: cellIndex, patch: LiverBingoCellPatchSchema }),
  z.object({ type: z.literal('focus'), index: cellIndex.nullable() }),
  z.object({ type: z.literal('reset') }),
])
export type LiverBingoCommandType = z.infer<typeof LiverBingoCommandSchema>

/** send-bingo-command: リクエスト */
export const SendBingoCommandRequestSchema = z.object({
  command: LiverBingoCommandSchema,
})
export type SendBingoCommandRequestType = z.infer<typeof SendBingoCommandRequestSchema>

/** send-bingo-command: レスポンス(seq はサーバーが付ける。時刻ベースで、サーバーを再起動しても戻らない) */
export const SendBingoCommandResponseSchema = z.object({
  seq: z.number(),
})
export type SendBingoCommandResponseType = z.infer<typeof SendBingoCommandResponseSchema>

/** load-bingo-commands: レスポンス用の 1 件 */
export const BingoCommandEntrySchema = z.object({
  seq: z.number(),
  command: LiverBingoCommandSchema,
})
export type BingoCommandEntryType = z.infer<typeof BingoCommandEntrySchema>

/**
 * load-bingo-commands: レスポンス
 * - latest: これまでに積まれた最後の seq(無ければ 0)。受け取り側はこれを次の since にする
 * - commands: since より新しい命令(古い順)。since 未指定のときは空(受け取り側が基準を決めるための問い合わせ)
 */
export const LoadBingoCommandsResponseSchema = z.object({
  latest: z.number(),
  commands: z.array(BingoCommandEntrySchema),
})
export type LoadBingoCommandsResponseType = z.infer<typeof LoadBingoCommandsResponseSchema>

/** OBS のカードの写し(LiveConsole の表示用) */
export const LiverBingoSnapshotSchema = z.object({
  cardSize: z.number().int().min(1).max(20),
  cells: z
    .array(
      z.object({
        title: z.string(),
        progress: z.number(),
        target: z.number(),
        unit: z.number(),
        fixed: z.boolean(), // 固定項目のマスか
      })
    )
    .max(400),
  focus: z.number().int().nullable(), // 注目中のマス
  lineCount: z.number().int().min(0), // 成立しているライン数
})
export type LiverBingoSnapshotType = z.infer<typeof LiverBingoSnapshotSchema>

/** save-bingo-snapshot: リクエスト */
export const SaveBingoSnapshotRequestSchema = z.object({
  snapshot: LiverBingoSnapshotSchema,
})
export type SaveBingoSnapshotRequestType = z.infer<typeof SaveBingoSnapshotRequestSchema>

/**
 * load-bingo-snapshot: レスポンス
 * - snapshot: まだ OBS から届いていなければ null
 * - updatedAt: サーバーが写しを受け取った時刻(ミリ秒。届いていなければ 0)。OBS が止まっていないかの判断に使う
 */
export const LoadBingoSnapshotResponseSchema = z.object({
  snapshot: LiverBingoSnapshotSchema.nullable(),
  updatedAt: z.number(),
})
export type LoadBingoSnapshotResponseType = z.infer<typeof LoadBingoSnapshotResponseSchema>
