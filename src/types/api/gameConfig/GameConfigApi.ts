// src/types/api/gameConfig/GameConfigApi.ts
import { z } from 'zod'

/**
 * LiveConsole のゲームの設定 (server/data/game-configs/<gameKey>.json) の API
 * - サーバーは、設定の中身を知らない (ゲームごとの形は、ゲーム側のスキーマで検証する)
 * - gameKey は、ゲームの画面のキー (ConsoleViewKey)。ファイル名になるため、英数字だけ
 */
export const GameConfigKeySchema = z.string().regex(/^[A-Za-z][A-Za-z0-9]{0,63}$/, '英字で始まる英数字のみ、64文字以内')
export type GameConfigKeyType = z.infer<typeof GameConfigKeySchema>

/** 設定の中身 (ゲームごとに違うので、オブジェクトであることだけを見る) */
export const GameConfigValueSchema = z.record(z.string(), z.unknown())
export type GameConfigValueType = z.infer<typeof GameConfigValueSchema>

/** load-game-config: レスポンス (保存されていなければ 404) */
export const LoadGameConfigResponseSchema = z.object({
  gameKey: GameConfigKeySchema,
  config: GameConfigValueSchema,
  updatedAt: z.number(),
})
export type LoadGameConfigResponseType = z.infer<typeof LoadGameConfigResponseSchema>

/** save-game-config: リクエスト (同じ gameKey なら上書き) */
export const SaveGameConfigRequestSchema = z.object({
  gameKey: GameConfigKeySchema,
  config: GameConfigValueSchema,
})
export type SaveGameConfigRequestType = z.infer<typeof SaveGameConfigRequestSchema>

/** save-game-config: レスポンス (updatedAt はサーバーが付ける) */
export const SaveGameConfigResponseSchema = z.object({
  gameKey: GameConfigKeySchema,
  updatedAt: z.number(),
})
export type SaveGameConfigResponseType = z.infer<typeof SaveGameConfigResponseSchema>
