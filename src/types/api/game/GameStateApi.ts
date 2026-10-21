// src/types/api/game/GameStateApi.ts
import { z } from 'zod'
import { GameStateSchema } from './GameStateSchema'

/**
 * 配信ID (ファイル名になるため、英数字・_・- のみ)
 * 例: '20261020-2130'
 */
export const StreamIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,100}$/, '英数字・_・- のみ、100文字以内')
export type StreamIdType = z.infer<typeof StreamIdSchema>

/**
 * 1配信ぶんの保存ファイル (server/streams/<streamId>.json)
 * states は eventKey ごとの GameState
 */
export const StreamGameFileSchema = z.object({
  streamId: StreamIdSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
  states: z.record(z.string(), GameStateSchema).default({}),
})
export type StreamGameFileType = z.infer<typeof StreamGameFileSchema>

/**
 * save-game-state: リクエスト (state の eventKey の枠を、丸ごと上書きする)
 */
export const GameStateSaveRequestSchema = z.object({
  streamId: StreamIdSchema,
  state: GameStateSchema,
})
export type GameStateSaveRequestType = z.infer<typeof GameStateSaveRequestSchema>

/**
 * save-game-state: レスポンス
 */
export const GameStateSaveResponseSchema = z.object({
  streamId: StreamIdSchema,
  eventKey: z.string(),
  updatedAt: z.number(),
})
export type GameStateSaveResponseType = z.infer<typeof GameStateSaveResponseSchema>

/**
 * list-game-states: 一覧の1件 (更新日時の新しい順)
 */
export const GameStateListItemSchema = z.object({
  streamId: StreamIdSchema,
  updatedAt: z.number(),
})
export type GameStateListItemType = z.infer<typeof GameStateListItemSchema>
