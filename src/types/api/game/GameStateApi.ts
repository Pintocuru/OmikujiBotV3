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
 * 1配信ぶんの保存ファイル (server/data/streams/<streamId>.json)
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
 * profileImage は、userMap のユーザーのアイコンとして保存する (ログには入れない)。
 * http(s) 以外 (コメントテスターの base64 など) はサーバ側で無視する。
 */
export const GameLogAppendRequestSchema = z.object({
  streamId: StreamIdSchema,
  eventKey: z.string().min(1),
  log: GameLogSchema,
  profileImage: z.string().optional(),
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
 * append-game-logs: リクエスト
 * 同じ eventKey の state に、ログを複数件まとめて追記する (1レースの全員ぶんなど)。
 * 1回の書き込みで保存するので、全件保存されるか、1件も保存されないかのどちらか。
 * 同じ log.id は保存済みでも、リクエスト内の重複でも1件だけ保存する (再送しても二重にならない)
 */
export const MAX_GAME_LOGS_PER_APPEND = 100
export const GameLogsAppendRequestSchema = z.object({
  streamId: StreamIdSchema,
  eventKey: z.string().min(1),
  logs: z.array(GameLogSchema).min(1).max(MAX_GAME_LOGS_PER_APPEND),
  profileImage: z.string().optional(),
})
export type GameLogsAppendRequestType = z.infer<typeof GameLogsAppendRequestSchema>

/**
 * append-game-logs: レスポンス
 * 保存済み・重複で保存しなかった件数は skippedCount
 */
export const GameLogsAppendResponseSchema = z.object({
  streamId: StreamIdSchema,
  eventKey: z.string(),
  updatedAt: z.number(),
  appendedCount: z.number(),
  skippedCount: z.number(),
})
export type GameLogsAppendResponseType = z.infer<typeof GameLogsAppendResponseSchema>

/**
 * list-game-states: 一覧の1件 (更新日時の新しい順)
 */
export const GameStateListItemSchema = z.object({
  streamId: StreamIdSchema,
  updatedAt: z.number(),
})
export type GameStateListItemType = z.infer<typeof GameStateListItemSchema>
