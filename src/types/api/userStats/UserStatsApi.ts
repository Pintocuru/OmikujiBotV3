// src/types/api/userStats/UserStatsApi.ts
import { daisyUIColor } from '@/types/core'
import { z } from 'zod'
import { UserStatsRecord } from './UserStatsRecordSchema'

/**
 * 外部 (ブラウザ) から変更できるフィールド
 * Generator 独自のフィールドのみ。コメント由来の値 (tc / no / giftPrice など) は含めない。
 * ※ zod 4 は .pick().partial() だと default が効いて未指定が上書きされるため、明示的に定義している。
 */
export const UserStatsPatchSchema = z.object({
  order: z.number().optional(),
  team: z.enum(daisyUIColor).nullable().optional(),
  score: z.number().optional(),
  tags: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
})
export type UserStatsPatch = z.infer<typeof UserStatsPatchSchema>

// UserStatsRecord の対応フィールドと型がずれたら、ここでコンパイルエラーになる
type Assert<T extends true> = T
export type _PatchMatchesRecord = Assert<UserStatsPatch extends Partial<UserStatsRecord> ? true : false>

/**
 * 1ユーザーぶんの更新
 * - set: 指定したフィールドを上書き (tags / badges は配列ごと置き換え)
 * - addScore: score に加算 (複数の操作元から同時に加点しても、取りこぼさない)
 * 両方ある場合は set → addScore の順に適用する
 */
export const UserStatsUpdateSchema = z
  .object({
    userId: z.string().min(1),
    set: UserStatsPatchSchema.optional(),
    addScore: z.number().finite().optional(),
  })
  .refine((u) => u.set !== undefined || u.addScore !== undefined, 'set か addScore のどちらかが必要です')
export type UserStatsUpdateType = z.infer<typeof UserStatsUpdateSchema>

/**
 * update-user-stats: リクエスト / レスポンス
 */
export const UserStatsUpdateRequestSchema = z.object({
  updates: z.array(UserStatsUpdateSchema).min(1).max(200),
})
export type UserStatsUpdateRequestType = z.infer<typeof UserStatsUpdateRequestSchema>

export const UserStatsUpdateResponseSchema = z.object({
  revision: z.number(),
  updated: z.number(),
})
export type UserStatsUpdateResponseType = z.infer<typeof UserStatsUpdateResponseSchema>

/**
 * サーバが保持する、ユーザーごとの操作結果
 * rev: 最後に変更されたときのリビジョン (差分取得に使う)
 */
export const UserStatsControlSchema = UserStatsPatchSchema.extend({
  rev: z.number(),
  updatedAt: z.number(),
})
export type UserStatsControlType = z.infer<typeof UserStatsControlSchema>

/**
 * load-user-stats: レスポンス
 * - since 以降に変更されたユーザーだけを返す
 * - isFull が true のときは全件。受け取り側は保持している操作結果を、この内容で置き換える
 *   (since 未指定 / リセット後 / サーバ側のリビジョンより先の値を持っているとき)
 */
export const UserStatsLoadResponseSchema = z.object({
  revision: z.number(),
  isFull: z.boolean(),
  users: z.record(z.string(), UserStatsControlSchema),
})
export type UserStatsLoadResponseType = z.infer<typeof UserStatsLoadResponseSchema>
