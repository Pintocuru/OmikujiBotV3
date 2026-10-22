// src/types/api/game/GameStateApi.ts
import { z } from 'zod'
import { GameLogSchema, GameStateSchema } from './GameStateSchema'

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
 * append-game-log: リクエスト
 * eventKey の state に、ログを1件追記する (userMap の統計もサーバ側で更新する)
 */
export const GameLogAppendRequestSchema = z.object({
  streamId: StreamIdSchema,
  eventKey: z.string().min(1),
  log: GameLogSchema,
})
export type GameLogAppendRequestType = z.infer<typeof GameLogAppendRequestSchema>

/**
 * append-game-log: レスポンス
 * appended が false のときは、同じ log.id が保存済みだったため何もしていない
 */
export const GameLogAppendResponseSchema = z.object({
  streamId: StreamIdSchema,
  eventKey: z.string(),
  updatedAt: z.number(),
  appended: z.boolean(),
})
export type GameLogAppendResponseType = z.infer<typeof GameLogAppendResponseSchema>

/**
 * list-game-states: 一覧の1件 (更新日時の新しい順)
 */
export const GameStateListItemSchema = z.object({
  streamId: StreamIdSchema,
  updatedAt: z.number(),
})
export type GameStateListItemType = z.infer<typeof GameStateListItemSchema>
