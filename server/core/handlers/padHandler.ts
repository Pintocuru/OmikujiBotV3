// server/core/handlers/padHandler.ts
// ポン出し: LiveConsole (Chrome) でボタンが押されたことを覚え、Generator (OBS) からのポーリングに答える。
// 保持するのは「最後の発火」だけ。保存はしない (サーバーを再起動したら空に戻る)。
import { ApiResult } from '@server/types'
import { ok, badRequest } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import type { PadIdType } from '@/types/OmikujiData'
import { PadTriggerRequestSchema, type PadStatusResponseType, type PadTriggerResponseType } from '@/types/api'

interface LastFired {
  padId: PadIdType
  firedAt: number
}

let last: LastFired | null = null

/**
 * ボタンが押されたことを記録する
 * 発火時刻はサーバが付ける。同じミリ秒に2回押されても since で区別できるよう、前回より必ず進める
 */
export async function triggerPad(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(PadTriggerRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  const firedAt = Math.max(Date.now(), (last?.firedAt ?? 0) + 1)
  last = { padId: parsed.data.padId, firedAt }

  const response: PadTriggerResponseType = { padId: parsed.data.padId, firedAt }
  return ok(response)
}

/**
 * since より新しい発火があるかを返す
 * since が無い (または数値でない) ときは、発火の有無にかかわらず hasNew: false で、最後の発火時刻だけを返す
 */
export async function loadPadStatus(since?: string): Promise<ApiResult> {
  const latest = last?.firedAt ?? 0
  const sinceMs = since === undefined || since.trim() === '' ? NaN : Number(since)

  const hasNew = last !== null && Number.isFinite(sinceMs) && last.firedAt > sinceMs
  const response: PadStatusResponseType = {
    hasNew,
    firedAt: latest,
    padId: hasNew && last ? last.padId : null,
  }
  return ok(response)
}
