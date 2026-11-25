// src/types/api/ai/AiApi.ts
import { z } from 'zod'

/**
 * 生成 AI の接続先の API (server/ai-settings.json)。WordAlchemy などのゲームが、サーバーの中継ハンドラ経由で使う
 * - 接続先は「メイン」と「サブ」の 2 つ。メインが上限超過・エラーのときは、サブに切り替える
 * - API キーは、保存するときだけ送る。サーバーは、キーを画面 (レスポンス) に返さない (末尾 4 文字のヒントだけ返す)
 */
export const AiProviderSchema = z.enum(['openai', 'anthropic'])
/** openai: OpenAI 互換 API (baseURL・モデル・キーを指定。互換サービスやローカル LLM も使える) / anthropic: Anthropic */
export type AiProviderType = z.infer<typeof AiProviderSchema>

export const AI_SLOT_KEYS = ['main', 'sub'] as const
export const AiSlotKeySchema = z.enum(AI_SLOT_KEYS)
export type AiSlotKeyType = z.infer<typeof AiSlotKeySchema>

const AiBaseUrlSchema = z
  .string()
  .trim()
  .max(300)
  .regex(/^https?:\/\/\S+$/, 'http:// か https:// で始まる URL')
const AiModelSchema = z.string().trim().min(1, 'モデル名を入力してください').max(200)

/** save-ai-settings: 1 つの接続先 (apiKey を省略か空にすると、保存済みのキーをそのまま使う) */
export const SaveAiSlotSchema = z.object({
  provider: AiProviderSchema,
  baseUrl: AiBaseUrlSchema,
  model: AiModelSchema,
  apiKey: z.string().trim().max(500).optional(),
})
export type SaveAiSlotType = z.infer<typeof SaveAiSlotSchema>

/** save-ai-settings: リクエスト (null は、その接続先を使わない = 保存済みのキーも削除する) */
export const SaveAiSettingsRequestSchema = z.object({
  main: SaveAiSlotSchema.nullable(),
  sub: SaveAiSlotSchema.nullable(),
})
export type SaveAiSettingsRequestType = z.infer<typeof SaveAiSettingsRequestSchema>

/** load-ai-settings / save-ai-settings: 保存されている接続先 (キーは含めない。keyHint は「…」+ 末尾 4 文字) */
export const AiSlotInfoSchema = z.object({
  provider: AiProviderSchema,
  baseUrl: z.string(),
  model: z.string(),
  keyHint: z.string(),
})
export type AiSlotInfoType = z.infer<typeof AiSlotInfoSchema>

export const LoadAiSettingsResponseSchema = z.object({
  main: AiSlotInfoSchema.nullable(),
  sub: AiSlotInfoSchema.nullable(),
})
export type LoadAiSettingsResponseType = z.infer<typeof LoadAiSettingsResponseSchema>

/**
 * ask-ai: リクエスト (プロンプトを渡して、返事の文字列を受け取る)
 * - 接続先の選び方 (メイン → サブ) と、上限超過した接続先の休ませ方は、サーバーが決める
 * - エラー: 400 = 接続先が未設定 / 429 = 使える接続先がすべて上限超過 / 502 = すべて失敗 (通信エラー・認証エラーなど)
 */
export const AskAiRequestSchema = z.object({ prompt: z.string().min(1).max(4000) })
export type AskAiRequestType = z.infer<typeof AskAiRequestSchema>

/** ask-ai: レスポンス (slot は、実際に使った接続先) */
export const AskAiResponseSchema = z.object({ text: z.string(), slot: AiSlotKeySchema })
export type AskAiResponseType = z.infer<typeof AskAiResponseSchema>
