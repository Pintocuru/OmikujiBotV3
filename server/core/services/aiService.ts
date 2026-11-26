// server/core/services/aiService.ts
// 生成 AI への中継 (OpenAI 互換 API / Anthropic)。接続先は「メイン → サブ」の順に試す。
// キーとプロンプトは、ログに出さない
import axios from 'axios'
import type { AiProviderType, AiSlotKeyType } from '@/types/api'

export type AiSlotConfig = { provider: AiProviderType; baseUrl: string; model: string; apiKey: string }
export type AiSettingsStored = { main: AiSlotConfig | null; sub: AiSlotConfig | null }

/** 試す順番 */
const SLOT_ORDER: readonly AiSlotKeyType[] = ['main', 'sub']

/** 1 回の呼び出しを待つ上限 (ミリ秒) */
const TIMEOUT_MS = 20_000
/** 返事の長さの上限 (出力は {"c","k","n"} だけなので、小さくてよい) */
const MAX_TOKENS = 200
/** 上限超過 (429) した接続先を休ませる時間。Retry-After があればそれに従う (上限つき) */
const COOLDOWN_RATE_LIMIT_MS = 60_000
const COOLDOWN_RATE_LIMIT_MAX_MS = 10 * 60_000
/** 認証エラー (キーの間違いなど) の接続先を休ませる時間 */
const COOLDOWN_AUTH_MS = 60_000
/** そのほかの失敗 (通信エラー・タイムアウト・5xx など) の接続先を休ませる時間 */
const COOLDOWN_ERROR_MS = 15_000

export type AiHttpResponse = { status: number; data: unknown; headers: Record<string, unknown> }
/** HTTP の POST (テストで差し替える。ステータスが 200 番台でなくても、例外にしない) */
export type AiHttpPost = (
  url: string,
  body: unknown,
  headers: Record<string, string>,
  timeoutMs: number
) => Promise<AiHttpResponse>

const axiosPost: AiHttpPost = async (url, body, headers, timeoutMs) => {
  const response = await axios.post(url, body, { headers, timeout: timeoutMs, validateStatus: () => true })
  return { status: response.status, data: response.data, headers: response.headers as Record<string, unknown> }
}

type FailureKind = 'rateLimited' | 'unauthorized' | 'error'
type ProviderOutcome = { ok: true; text: string } | { ok: false; kind: FailureKind; retryAfterMs?: number }

const trimBase = (baseUrl: string) => baseUrl.replace(/\/+$/, '')

const buildRequest = (
  slot: AiSlotConfig,
  prompt: string,
  tokenParam: 'max_tokens' | 'max_completion_tokens'
): { url: string; headers: Record<string, string>; body: unknown } => {
  const base = trimBase(slot.baseUrl)
  const messages = [{ role: 'user', content: prompt }]
  if (slot.provider === 'anthropic') {
    return {
      url: base.endsWith('/v1') ? `${base}/messages` : `${base}/v1/messages`,
      headers: { 'content-type': 'application/json', 'x-api-key': slot.apiKey, 'anthropic-version': '2023-06-01' },
      body: { model: slot.model, max_tokens: MAX_TOKENS, messages },
    }
  }
  return {
    url: `${base}/chat/completions`,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${slot.apiKey}` },
    body: { model: slot.model, [tokenParam]: MAX_TOKENS, messages },
  }
}

/** 返事の本文を取り出す (取り出せなければ null) */
const extractText = (provider: AiProviderType, data: unknown): string | null => {
  const d = data as any
  if (provider === 'anthropic') {
    const block = Array.isArray(d?.content) ? d.content.find((b: any) => b?.type === 'text') : undefined
    return typeof block?.text === 'string' ? block.text : null
  }
  const content = d?.choices?.[0]?.message?.content
  return typeof content === 'string' ? content : null
}

const parseRetryAfterMs = (headers: Record<string, unknown>): number | undefined => {
  const seconds = Number(headers['retry-after'])
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined
}

/** 本文に、トークン数の指定名の違いを示す文があるか (新しい OpenAI のモデルは max_tokens を受け付けず、max_completion_tokens を求める) */
const wantsCompletionTokens = (data: unknown): boolean => JSON.stringify(data ?? '').includes('max_completion_tokens')

/** API エラー本文から、診断に必要な情報だけを取り出す (レスポンス本文全体や生成内容はログに出さない) */
const errorDetails = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') return undefined
  const error = (data as Record<string, unknown>).error
  if (!error || typeof error !== 'object') return undefined
  const details = error as Record<string, unknown>
  return {
    code: typeof details.code === 'string' || typeof details.code === 'number' ? details.code : undefined,
    status: typeof details.status === 'string' ? details.status : undefined,
    message: typeof details.message === 'string' ? details.message.slice(0, 1000) : undefined,
  }
}

/** HTTP エラー本文の診断用ログ (長さ制限と秘密情報のマスキングを行う) */
const safeErrorBody = (data: unknown): string => {
  let raw: string
  try {
    raw = typeof data === 'string' ? data : JSON.stringify(data)
  } catch {
    raw = String(data)
  }
  return raw
    .replace(/(Bearer\\s+)[^\\s"']+/gi, '$1[REDACTED]')
    .replace(/(api[_-]?key["'\\s:=]+)[^\\s,"'&]+/gi, '$1[REDACTED]')
    .slice(0, 2000)
}

/** 成功レスポンスでも、想定した形式でテキストを取り出せない場合に形式情報だけをログに出す */
const responseShape = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') return { type: typeof data }
  const d = data as Record<string, unknown>
  const choices = Array.isArray(d.choices) ? d.choices : undefined
  const first = choices?.[0] as Record<string, unknown> | undefined
  const message = first?.message as Record<string, unknown> | undefined
  return {
    keys: Object.keys(d),
    choicesCount: choices?.length,
    finishReason: first?.finish_reason,
    messageKeys: message && Object.keys(message),
    contentType: typeof message?.content,
  }
}

export type AiAskOutcome =
  | { ok: true; text: string; slot: AiSlotKeyType }
  | { ok: false; reason: 'notConfigured' | 'rateLimited' | 'failed' }

export class AiRelay {
  private readonly post: AiHttpPost
  private readonly now: () => number
  /** 休ませている接続先 (メモリだけ。サーバーを再起動したら、全部試し直す) */
  private readonly cooldowns = new Map<AiSlotKeyType, { until: number; kind: FailureKind }>()

  constructor(deps: { post?: AiHttpPost; now?: () => number } = {}) {
    this.post = deps.post ?? axiosPost
    this.now = deps.now ?? Date.now
  }

  /** 接続先の設定を変えたら、休ませていたものも試し直す */
  resetCooldowns(): void {
    this.cooldowns.clear()
  }

  /**
   * メイン → サブの順に試して、最初に返事が取れたものを返す。
   * 休ませている接続先は、通信せずに飛ばす (全部休ませているなら、待たずにすぐ失敗を返す)
   */
  async ask(settings: AiSettingsStored, prompt: string): Promise<AiAskOutcome> {
    const slots = SLOT_ORDER.filter((key) => settings[key])
    if (slots.length === 0) return { ok: false, reason: 'notConfigured' }

    let sawRateLimit = false
    for (const key of slots) {
      const cooldown = this.cooldowns.get(key)
      if (cooldown && cooldown.until > this.now()) {
        sawRateLimit ||= cooldown.kind === 'rateLimited'
        continue
      }
      const outcome = await this.callSlot(settings[key]!, prompt)
      if (outcome.ok) {
        this.cooldowns.delete(key)
        return { ok: true, text: outcome.text, slot: key }
      }
      console.warn(`🤖 AI (${key}) failed: ${outcome.kind}`)
      this.cooldowns.set(key, { until: this.now() + cooldownMs(outcome), kind: outcome.kind })
      sawRateLimit ||= outcome.kind === 'rateLimited'
    }
    return { ok: false, reason: sawRateLimit ? 'rateLimited' : 'failed' }
  }

  private async callSlot(slot: AiSlotConfig, prompt: string): Promise<ProviderOutcome> {
    try {
      let response = await this.send(slot, prompt, 'max_tokens')
      if (response.status === 400 && slot.provider === 'openai' && wantsCompletionTokens(response.data)) {
        response = await this.send(slot, prompt, 'max_completion_tokens')
      }
      if (response.status < 200 || response.status >= 300) {
        console.error(`AI (${slot.provider}) HTTP failure`, {
          status: response.status,
          error: errorDetails(response.data),
          rawBody: safeErrorBody(response.data),
          headers: {
            contentType: response.headers['content-type'],
            requestId: response.headers['x-goog-request-id'] ?? response.headers['x-request-id'],
          },
        })
        if (response.status === 429) return { ok: false, kind: 'rateLimited', retryAfterMs: parseRetryAfterMs(response.headers) }
        if (response.status === 401 || response.status === 403) return { ok: false, kind: 'unauthorized' }
        return { ok: false, kind: 'error' }
      }
      const text = extractText(slot.provider, response.data)
      if (!text) {
        console.error(`AI (${slot.provider}) response parsing failed`, responseShape(response.data))
        return { ok: false, kind: 'error' }
      }
      return { ok: true, text }
    } catch (error: unknown) {
      // 通信エラー・タイムアウト: URL・キー・プロンプト・レスポンス本文はログに出さない
      if (axios.isAxiosError(error)) {
        console.error(`AI (${slot.provider}) request error`, {
          code: error.code,
          message: error.message.slice(0, 500),
          status: error.response?.status,
          error: error.response ? errorDetails(error.response.data) : undefined,
        })
      } else {
        console.error(`AI (${slot.provider}) unexpected error`, error instanceof Error ? error.message.slice(0, 500) : typeof error)
      }
      return { ok: false, kind: 'error' }
    }
  }
  private send(slot: AiSlotConfig, prompt: string, tokenParam: 'max_tokens' | 'max_completion_tokens') {
    const { url, headers, body } = buildRequest(slot, prompt, tokenParam)
    return this.post(url, body, headers, TIMEOUT_MS)
  }
}

const cooldownMs = (failure: { kind: FailureKind; retryAfterMs?: number }): number => {
  if (failure.kind === 'rateLimited') return Math.min(failure.retryAfterMs ?? COOLDOWN_RATE_LIMIT_MS, COOLDOWN_RATE_LIMIT_MAX_MS)
  return failure.kind === 'unauthorized' ? COOLDOWN_AUTH_MS : COOLDOWN_ERROR_MS
}
