// server/core/services/aiService.test.ts
import { describe, expect, it } from 'vitest'
import { AiRelay, type AiHttpPost, type AiHttpResponse, type AiSettingsStored, type AiSlotConfig } from './aiService'

const main: AiSlotConfig = { provider: 'openai', baseUrl: 'https://api.example.com/v1/', model: 'm1', apiKey: 'sk-main-1234' }
const sub: AiSlotConfig = { provider: 'anthropic', baseUrl: 'https://api.anthropic.com', model: 'm2', apiKey: 'sk-sub-5678' }
const both: AiSettingsStored = { main, sub }

const openaiOk = (text: string): AiHttpResponse => ({ status: 200, data: { choices: [{ message: { content: text } }] }, headers: {} })
const anthropicOk = (text: string): AiHttpResponse => ({ status: 200, data: { content: [{ type: 'text', text }] }, headers: {} })
const status = (code: number, headers: Record<string, unknown> = {}, data: unknown = {}): AiHttpResponse => ({ status: code, data, headers })

/** 呼ばれた URL を記録して、用意した返事を順に返す */
const fake = (...responses: (AiHttpResponse | Error)[]) => {
  const calls: { url: string; body: any; headers: Record<string, string> }[] = []
  const post: AiHttpPost = async (url, body, headers) => {
    calls.push({ url, body, headers })
    const next = responses[calls.length - 1] ?? status(500)
    if (next instanceof Error) throw next
    return next
  }
  return { post, calls }
}

describe('AiRelay: 接続先ごとの呼び出し', () => {
  it('OpenAI 互換: chat/completions を呼び、Bearer・max_tokens・本文の取り出し', async () => {
    const { post, calls } = fake(openaiOk('{"c":"A"}'))
    const out = await new AiRelay({ post }).ask({ main, sub: null }, 'こんにちは')
    expect(out).toEqual({ ok: true, text: '{"c":"A"}', slot: 'main' })
    expect(calls[0].url).toBe('https://api.example.com/v1/chat/completions')
    expect(calls[0].headers.authorization).toBe('Bearer sk-main-1234')
    expect(calls[0].body).toMatchObject({ model: 'm1', max_tokens: 200, messages: [{ role: 'user', content: 'こんにちは' }] })
  })
  it('Anthropic: v1/messages を呼び、x-api-key・本文の取り出し (baseURL が /v1 で終わっていても重ならない)', async () => {
    const { post, calls } = fake(anthropicOk('ok'), anthropicOk('ok'))
    const relay = new AiRelay({ post })
    await relay.ask({ main: null, sub }, 'p')
    await relay.ask({ main: null, sub: { ...sub, baseUrl: 'https://proxy.example.com/v1' } }, 'p')
    expect(calls[0].url).toBe('https://api.anthropic.com/v1/messages')
    expect(calls[1].url).toBe('https://proxy.example.com/v1/messages')
    expect(calls[0].headers['x-api-key']).toBe('sk-sub-5678')
    expect(calls[0].headers['anthropic-version']).toBeTruthy()
  })
  it('新しい OpenAI のモデルが max_tokens を断ったら、max_completion_tokens で 1 回やり直す', async () => {
    const refuse = status(400, {}, { error: { message: "Unsupported parameter: 'max_tokens'. Use 'max_completion_tokens' instead." } })
    const { post, calls } = fake(refuse, openaiOk('ok'))
    const out = await new AiRelay({ post }).ask({ main, sub: null }, 'p')
    expect(out.ok).toBe(true)
    expect(calls[1].body.max_completion_tokens).toBe(200)
    expect(calls[1].body.max_tokens).toBeUndefined()
  })
  it('接続先が設定されていなければ、通信せずに notConfigured', async () => {
    const { post, calls } = fake()
    expect(await new AiRelay({ post }).ask({ main: null, sub: null }, 'p')).toEqual({ ok: false, reason: 'notConfigured' })
    expect(calls).toHaveLength(0)
  })
})

describe('AiRelay: 503 の再試行', () => {
  it('503 の後、2 秒待って再試行し、成功したら返す', async () => {
    const { post, calls } = fake(status(503), openaiOk('recovered'))
    const delays: number[] = []
    const relay = new AiRelay({ post, wait: async (ms) => { delays.push(ms) } })
    expect(await relay.ask({ main, sub: null }, 'p')).toEqual({ ok: true, text: 'recovered', slot: 'main' })
    expect(calls).toHaveLength(2)
    expect(delays).toEqual([2000])
  })
  it('503 が続いても、再試行は 2 回まで (合計 3 回) で止める', async () => {
    const { post, calls } = fake(status(503), status(503), status(503), openaiOk('unused'))
    const delays: number[] = []
    const relay = new AiRelay({ post, wait: async (ms) => { delays.push(ms) } })
    expect(await relay.ask({ main, sub: null }, 'p')).toEqual({ ok: false, reason: 'failed' })
    expect(calls).toHaveLength(3)
    expect(delays).toEqual([2000, 2000])
  })
})

describe('AiRelay: メインからサブへの切り替え', () => {
  it('メインが 429 なら、サブに切り替える', async () => {
    const { post, calls } = fake(status(429), anthropicOk('from-sub'))
    const out = await new AiRelay({ post }).ask(both, 'p')
    expect(out).toEqual({ ok: true, text: 'from-sub', slot: 'sub' })
    expect(calls).toHaveLength(2)
  })
  it('メインが通信エラー・5xx・認証エラー・本文なしでも、サブに切り替える', async () => {
    for (const first of [new Error('ECONNRESET'), status(500), status(401), status(200)]) {
      const { post } = fake(first, anthropicOk('from-sub'))
      expect(await new AiRelay({ post }).ask(both, 'p')).toMatchObject({ ok: true, slot: 'sub' })
    }
  })
  it('上限超過のメインは、休ませる間は通信せず、サブだけを使う。休みが明けたらメインを試し直す', async () => {
    let now = 0
    const { post, calls } = fake(status(429, { 'retry-after': '30' }), anthropicOk('s1'), anthropicOk('s2'), openaiOk('m-back'))
    const relay = new AiRelay({ post, now: () => now })
    await relay.ask(both, 'p') // メイン 429 → サブ
    now = 10_000
    const second = await relay.ask(both, 'p') // メインは休み中 → サブだけ
    expect(second).toMatchObject({ ok: true, slot: 'sub' })
    expect(calls.map((c) => c.url.includes('anthropic'))).toEqual([false, true, true])
    now = 31_000 // Retry-After の 30 秒が過ぎた
    expect(await relay.ask(both, 'p')).toMatchObject({ ok: true, text: 'm-back', slot: 'main' })
  })
  it('Retry-After がなければ 60 秒休ませる。長すぎる指定は 10 分までにする', async () => {
    let now = 0
    const { post, calls } = fake(status(429), openaiOk('ok'), status(429, { 'retry-after': '99999' }))
    const relay = new AiRelay({ post, now: () => now })
    await relay.ask({ main, sub: null }, 'p')
    now = 59_000
    expect((await relay.ask({ main, sub: null }, 'p')).ok).toBe(false)
    expect(calls).toHaveLength(1) // 休み中は通信しない
    now = 61_000
    expect((await relay.ask({ main, sub: null }, 'p')).ok).toBe(true)
    now = 62_000
    await relay.ask({ main, sub: null }, 'p') // → 429 (Retry-After 99999 秒)
    now = 62_000 + 10 * 60_000 - 1
    await relay.ask({ main, sub: null }, 'p')
    expect(calls).toHaveLength(3) // まだ休み中
    now = 62_000 + 10 * 60_000 + 1
    await relay.ask({ main, sub: null }, 'p')
    expect(calls).toHaveLength(4)
  })
  it('設定を変えたら (resetCooldowns)、休ませていた接続先も試し直す', async () => {
    const { post, calls } = fake(status(429), openaiOk('ok'))
    const relay = new AiRelay({ post, now: () => 0 })
    await relay.ask({ main, sub: null }, 'p')
    relay.resetCooldowns()
    expect((await relay.ask({ main, sub: null }, 'p')).ok).toBe(true)
    expect(calls).toHaveLength(2)
  })
})

describe('AiRelay: すべて使えないとき', () => {
  it('すべて上限超過なら rateLimited。どちらかが別の失敗なら、上限超過があれば rateLimited、なければ failed', async () => {
    expect(await new AiRelay({ post: fake(status(429), status(429)).post }).ask(both, 'p')).toEqual({ ok: false, reason: 'rateLimited' })
    expect(await new AiRelay({ post: fake(status(429), status(500)).post }).ask(both, 'p')).toEqual({ ok: false, reason: 'rateLimited' })
    expect(await new AiRelay({ post: fake(status(500), new Error('x')).post }).ask(both, 'p')).toEqual({ ok: false, reason: 'failed' })
  })
  it('全部休ませている間は、待たずにすぐ失敗を返す (通信しない)', async () => {
    const { post, calls } = fake(status(429), status(429))
    const relay = new AiRelay({ post, now: () => 0 })
    await relay.ask(both, 'p')
    expect(await relay.ask(both, 'p')).toEqual({ ok: false, reason: 'rateLimited' })
    expect(calls).toHaveLength(2)
  })
})
