// server/core/handlers/aiHandler.ts
// 生成 AI の接続先の設定 (server/ai-settings.json) と、AI への中継
import { z } from 'zod'
import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { AiRelay, type AiSettingsStored, type AiSlotConfig } from '@server/core/services/aiService'
import { ok, fail, badRequest, guard } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import { withLock } from '@server/core/utils/mutex'
import { FILE_NAME, HTTP } from '@server/core/constants'
import {
  AI_SLOT_KEYS,
  AiProviderSchema,
  AskAiRequestSchema,
  SaveAiSettingsRequestSchema,
  type AiSlotInfoType,
  type LoadAiSettingsResponseType,
} from '@/types/api'

/** ファイルに保存する形 (キーを含む。このファイルは画面にも、配布物にも、ログにも出さない) */
const StoredSlotSchema = z.object({
  provider: AiProviderSchema,
  baseUrl: z.string(),
  model: z.string(),
  apiKey: z.string().min(1),
})
const StoredSettingsSchema = z.object({ main: StoredSlotSchema.nullable(), sub: StoredSlotSchema.nullable() })

/** プロセス内で 1 つ (上限超過した接続先を休ませる記憶を、リクエストをまたいで持つため) */
const relay = new AiRelay()

const EMPTY: AiSettingsStored = { main: null, sub: null }

/** 保存されている設定を読む (まだない・読めないときは、接続先なし) */
async function readStored(): Promise<AiSettingsStored> {
  try {
    const parsed = StoredSettingsSchema.safeParse(await fileSystem.loadFile(null, FILE_NAME.aiSettings))
    return parsed.success ? parsed.data : EMPTY
  } catch (error: any) {
    if (error?.code !== 'ENOENT') console.error('Load AI settings error:', error?.code ?? 'unknown')
    return EMPTY
  }
}

/** 画面に返す形 (キーは返さず、末尾 4 文字のヒントだけ) */
const toInfo = (slot: AiSlotConfig | null): AiSlotInfoType | null =>
  slot
    ? {
        provider: slot.provider,
        baseUrl: slot.baseUrl,
        model: slot.model,
        keyHint: slot.apiKey.length > 4 ? `…${slot.apiKey.slice(-4)}` : '…',
      }
    : null

const toResponse = (stored: AiSettingsStored): LoadAiSettingsResponseType => ({
  main: toInfo(stored.main),
  sub: toInfo(stored.sub),
})

/** 保存されている接続先を取得 (キーは含まない。まだなければ、どちらも null) */
export async function loadAiSettings(): Promise<ApiResult> {
  return guard<unknown>('Load AI settings', 'Failed to load AI settings', async () => ok(toResponse(await readStored())))
}

/**
 * 接続先を保存 (メイン・サブそれぞれ。null なら、その接続先とキーを削除)
 * apiKey が空なら、保存済みのキーをそのまま使う (キーを返さないので、画面は毎回入力し直さなくてよい)
 */
export async function saveAiSettings(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(SaveAiSettingsRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  return withLock('ai-settings', () =>
    guard<unknown>('Save AI settings', 'Failed to save AI settings', async () => {
      const current = await readStored()
      const next: AiSettingsStored = { main: null, sub: null }
      for (const key of AI_SLOT_KEYS) {
        const input = parsed.data[key]
        if (!input) continue
        const apiKey = input.apiKey || current[key]?.apiKey
        if (!apiKey) return badRequest(`${key}.apiKey: API キーを入力してください`)
        next[key] = { provider: input.provider, baseUrl: input.baseUrl, model: input.model, apiKey }
      }
      await fileSystem.saveFile(null, FILE_NAME.aiSettings, JSON.stringify(next))
      relay.resetCooldowns()
      console.info('💾 Saved AI settings')
      return ok(toResponse(next))
    })
  )
}

/** AI にプロンプトを渡して、返事を受け取る (メイン → サブの順。上限超過・エラーの接続先は、しばらく飛ばす) */
export async function askAi(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(AskAiRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  return guard<unknown>('Ask AI', 'Failed to ask AI', async () => {
    const outcome = await relay.ask(await readStored(), parsed.data.prompt)
    if (outcome.ok) return ok({ text: outcome.text, slot: outcome.slot })
    if (outcome.reason === 'notConfigured') return badRequest('AI の接続先が設定されていません')
    if (outcome.reason === 'rateLimited') return fail(HTTP.TOO_MANY_REQUESTS, 'AI の利用上限に達しました')
    return fail(HTTP.BAD_GATEWAY, 'AI から返事を得られませんでした')
  })
}
