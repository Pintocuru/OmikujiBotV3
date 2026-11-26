// src/console/game/WordAlchemy/ai/alchemy.ts
// 完成品の判定の流れ: AI に聞く → 検証 → 失敗したらやり直し (最大 ALCHEMY_MAX_RETRIES 回) → それでも失敗なら Mock
import type { PotKey } from '../maps/WordAlchemyPotMap'
import { ALCHEMY_MAX_RETRIES } from '../scripts/wordAlchemyConstants'
import type { AlchemyResult, Rng } from './alchemyTypes'
import { buildPrompt } from './buildPrompt'
import { mockAlchemy } from './mockAlchemy'
import { validateResult } from './validateResult'

/** AI への問い合わせ (プロンプトを渡して、返事の文字列を受け取る)。実際の通信 (サーバーの中継ハンドラ) は、この形で差し込む */
export type AlchemyClient = { complete: (prompt: string) => Promise<string> }

/** 429 (上限超過)。Mock にフォールバックして、その旨を表示するための目印 */
export class AlchemyRateLimitError extends Error {}

export type AlchemyOutcome = {
  result: AlchemyResult
  /** ai: AI の結果が検証を通った / mock: Mock の結果 */
  source: 'ai' | 'mock'
  /** 上限超過で Mock にした (画面に表示する) */
  rateLimited: boolean
}

/**
 * pot は、煮込みに使う鍋 (闇鍋は、呼び出し側で resolveBrewPot を通した鍋。やり直しでも同じ鍋の指示を使う)。
 * client が null (キー未設定) のときは、Mock だけで進む。通信の失敗は、やり直さず Mock にする
 */
export const runAlchemy = async (
  materials: readonly string[],
  pot: PotKey,
  client: AlchemyClient | null,
  rng: Rng = Math.random
): Promise<AlchemyOutcome> => {
  const fallback = (rateLimited: boolean): AlchemyOutcome => ({
    result: mockAlchemy(materials, pot, rng),
    source: 'mock',
    rateLimited,
  })
  if (!client) return fallback(false)
  const prompt = buildPrompt(materials, pot)
  for (let attempt = 0; attempt <= ALCHEMY_MAX_RETRIES; attempt++) {
    try {
      const checked = validateResult(await client.complete(prompt), rng)
      if (checked.ok) return { result: checked.result, source: 'ai', rateLimited: false }
    } catch (error) {
      return fallback(error instanceof AlchemyRateLimitError)
    }
  }
  return fallback(false)
}
