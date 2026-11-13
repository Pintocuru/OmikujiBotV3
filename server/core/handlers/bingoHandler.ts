// server/core/handlers/bingoHandler.ts
// ライバービンゴ: LiveConsole (Chrome) と OBS のカードの間の「伝言板」。
// - 命令: LiveConsole が積み、OBS が since 付きで取りに来る (取りこぼさないよう、最新 MAX_COMMANDS 件を列で持つ)
// - 写し: OBS がカードの状態を送り、LiveConsole が表示のために取りに行く
// 保存はしない (サーバーを再起動したら空に戻る)。
import { ApiResult } from '@server/types'
import { ok, badRequest } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import {
  SaveBingoSnapshotRequestSchema,
  SendBingoCommandRequestSchema,
  type BingoCommandEntryType,
  type LiverBingoSnapshotType,
  type LoadBingoCommandsResponseType,
  type LoadBingoSnapshotResponseType,
  type SendBingoCommandResponseType,
} from '@/types/api'

/** 保持する命令の最大数(OBS が長く止まっていたときは、古い命令を捨てる) */
const MAX_COMMANDS = 100

let commands: BingoCommandEntryType[] = []
let lastSeq = 0
let snapshot: LiverBingoSnapshotType | null = null
let snapshotUpdatedAt = 0

/**
 * 命令を積む
 * seq は時刻ベースで、同じミリ秒でも前回より必ず進める (サーバーを再起動しても戻らず、OBS の since とずれない)
 */
export async function sendBingoCommand(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(SendBingoCommandRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  lastSeq = Math.max(Date.now(), lastSeq + 1)
  commands = [...commands, { seq: lastSeq, command: parsed.data.command }].slice(-MAX_COMMANDS)

  const response: SendBingoCommandResponseType = { seq: lastSeq }
  return ok(response)
}

/**
 * since より新しい命令を返す
 * since が無い (または数値でない) ときは、命令を返さず latest だけを返す (OBS を開き直したときに、過去の命令を再生しないため)
 */
export async function loadBingoCommands(since?: string): Promise<ApiResult> {
  const sinceSeq = since === undefined || since.trim() === '' ? NaN : Number(since)
  const response: LoadBingoCommandsResponseType = {
    latest: lastSeq,
    commands: Number.isFinite(sinceSeq) ? commands.filter((entry) => entry.seq > sinceSeq) : [],
  }
  return ok(response)
}

/**
 * OBS のカードの写しを受け取る
 */
export async function saveBingoSnapshot(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(SaveBingoSnapshotRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  snapshot = parsed.data.snapshot
  snapshotUpdatedAt = Date.now()
  return ok({ updatedAt: snapshotUpdatedAt })
}

/**
 * 最後に届いたカードの写しを返す
 */
export async function loadBingoSnapshot(): Promise<ApiResult> {
  const response: LoadBingoSnapshotResponseType = { snapshot, updatedAt: snapshotUpdatedAt }
  return ok(response)
}

/** テスト用: 状態を空に戻す */
export function resetBingoStateForTest(): void {
  commands = []
  lastSeq = 0
  snapshot = null
  snapshotUpdatedAt = 0
}
