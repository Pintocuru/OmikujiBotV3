// server/core/handlers/userStatsHandler.ts
// ブラウザから操作したユーザー統計 (score / team / tags / badges / order) を保持する。
// Generator (OBS) は load-user-stats を since 付きでポーリングして、差分を取り込む。
import { z } from 'zod'
import { ApiResult } from '@server/types'
import { loadFile, saveFile } from '@server/core/services/fileSystemService'
import { ok, badRequest, guard } from '@server/core/utils/result'
import { parseWith } from '@server/core/utils/schema'
import { withLock } from '@server/core/utils/mutex'
import { FILE_NAME } from '@server/core/constants'
import { randomUUID } from 'node:crypto'
import { getCommentUsers, resetCommentUsers } from '@server/core/services/userListService'
import { buildUserList } from '@server/core/utils/userList'
import {
  AddManualUserRequestSchema,
  RemoveManualUserRequestSchema,
  UserStatsControlSchema,
  UserStatsControlType,
  UserStatsUpdateRequestSchema,
} from '@/types/api'

const LOCK_KEY = 'user-stats'

/**
 * 保存ファイル (server/userStats.json) の形
 * - revision: 変更のたびに +1 される通し番号
 * - baseRevision: 最後にリセットされたときの revision。これより古い since は差分で渡せない
 */
const UserStatsFileSchema = z.object({
  revision: z.number(),
  baseRevision: z.number(),
  users: z.record(z.string(), UserStatsControlSchema),
})

interface StoreState {
  revision: number
  baseRevision: number
  users: Map<string, UserStatsControlType> // userId をキーに使うので、プロトタイプの影響を受けない Map で持つ
}

let cache: StoreState | null = null

async function getState(): Promise<StoreState> {
  if (cache) return cache

  try {
    const file = UserStatsFileSchema.parse(await loadFile(null, FILE_NAME.userStats))
    cache = { revision: file.revision, baseRevision: file.baseRevision, users: new Map(Object.entries(file.users)) }
  } catch (error: any) {
    if (error?.code !== 'ENOENT') console.error('User stats file is unreadable, starting empty:', error)
    cache = { revision: 0, baseRevision: 0, users: new Map() }
  }
  return cache
}

/**
 * 保存に成功したら cache を差し替える (保存に失敗したときに、メモリだけ進まないようにする)
 */
async function commit(next: StoreState): Promise<void> {
  const file = { revision: next.revision, baseRevision: next.baseRevision, users: Object.fromEntries(next.users) }
  await saveFile(null, FILE_NAME.userStats, JSON.stringify(file))
  cache = next
}

/**
 * 操作結果を取得
 * since 以降に変更されたユーザーだけを返す。since 未指定・リセット前の値・サーバより先の値のときは全件 (isFull)
 */
export async function loadUserStats(since?: string): Promise<ApiResult> {
  let sinceRevision: number | undefined
  if (since !== undefined && since !== '') {
    sinceRevision = Number(since)
    if (!Number.isInteger(sinceRevision) || sinceRevision < 0) {
      return badRequest('since must be a non-negative integer')
    }
  }

  return withLock(LOCK_KEY, () =>
    guard('Load user stats', 'Failed to load user stats', async () => {
      const state = await getState()
      const isFull = sinceRevision === undefined || sinceRevision < state.baseRevision || sinceRevision > state.revision

      const entries = [...state.users].filter(([, control]) => isFull || control.rev > sinceRevision!)
      return ok({ revision: state.revision, isFull, users: Object.fromEntries(entries) })
    })
  )
}

/**
 * 操作結果を更新 (1リクエスト = 1リビジョン)
 */
export async function updateUserStats(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(UserStatsUpdateRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  return withLock(LOCK_KEY, () =>
    guard('Update user stats', 'Failed to update user stats', async () => {
      const state = await getState()
      const revision = state.revision + 1
      const now = Date.now()
      const users = new Map(state.users)

      for (const { userId, set, addScore } of parsed.data.updates) {
        const previous = users.get(userId)
        const next: UserStatsControlType = { ...previous, ...set, rev: revision, updatedAt: now }
        if (addScore !== undefined) next.score = (next.score ?? 0) + addScore
        users.set(userId, next)
      }

      await commit({ revision, baseRevision: state.baseRevision, users })
      return ok({ revision, updated: parsed.data.updates.length })
    })
  )
}

/**
 * 操作結果を全件リセット
 * 以後、古い since を持つ受け取り側には、必ず全件 (isFull) が返る
 */
export async function resetUserStats(): Promise<ApiResult> {
  return withLock(LOCK_KEY, () =>
    guard('Reset user stats', 'Failed to reset user stats', async () => {
      const state = await getState()
      const revision = state.revision + 1

      await commit({ revision, baseRevision: revision, users: new Map() })
      console.info('🧹 Reset user stats')
      return ok({ revision })
    })
  )
}

/**
 * ユーザーリストを取得 (LiveConsole 用)
 * コメント由来のユーザー + 手動で追加したユーザー に、操作結果を合わせて返す
 */
export async function loadUsers(): Promise<ApiResult> {
  return withLock(LOCK_KEY, () =>
    guard('Load users', 'Failed to load users', async () => {
      const state = await getState()
      return ok({ revision: state.revision, users: buildUserList(getCommentUsers(), state.users) })
    })
  )
}

/**
 * 手動でユーザーを追加 (コメントしない ROM 勢など)
 * userId は 'manual:' + 乱数。操作結果として保存するので、generator も load-user-stats で受け取れる
 */
export async function addManualUser(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(AddManualUserRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  return withLock(LOCK_KEY, () =>
    guard('Add manual user', 'Failed to add manual user', async () => {
      const state = await getState()
      const revision = state.revision + 1
      const userId = `manual:${randomUUID()}`
      const users = new Map(state.users)
      users.set(userId, { rev: revision, updatedAt: Date.now(), isManual: true, userName: parsed.data.userName })

      await commit({ revision, baseRevision: state.baseRevision, users })
      return ok({ userId, revision })
    })
  )
}

/**
 * 手動で追加したユーザーを削除
 * 差分取得 (since) で削除を伝えるため、レコードは消さずに isRemoved を付ける
 */
export async function removeManualUser(body: unknown): Promise<ApiResult> {
  const parsed = parseWith(RemoveManualUserRequestSchema, body)
  if (!parsed.ok) return badRequest(parsed.error)

  return withLock(LOCK_KEY, async () => {
    const state = await getState()
    const previous = state.users.get(parsed.data.userId)
    if (!previous?.isManual) return badRequest('手動で追加したユーザーではありません')

    return guard('Remove manual user', 'Failed to remove manual user', async () => {
      const revision = state.revision + 1
      const users = new Map(state.users)
      users.set(parsed.data.userId, { ...previous, isRemoved: true, rev: revision, updatedAt: Date.now() })

      await commit({ revision, baseRevision: state.baseRevision, users })
      return ok({ revision })
    })
  })
}

/**
 * コメント由来のユーザーリストを空にする (手動の操作結果と手動ユーザーは残る)
 */
export async function resetUsers(): Promise<ApiResult> {
  resetCommentUsers()
  console.info('🧹 Reset comment users')
  return ok({ reset: true })
}
