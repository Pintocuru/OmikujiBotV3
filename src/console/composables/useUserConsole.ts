// src/console/composables/useUserConsole.ts
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { userStatsApi } from '@/manager/services/userStatsApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import type { UserListItemType, UserStatsUpdateType } from '@/types/api'
import type { DaisyUIColorType } from '@/types/core'
import { buildClearOrderUpdates, buildOrderUpdates, chunkUpdates } from '../scripts/userConsole'
import type { ConsoleStatus } from './useLiveConsole'

const REFRESH_INTERVAL_MS = 5000

/**
 * ユーザー操作画面のデータと操作
 * - 操作は、画面にすぐ反映 (楽観的更新) してからサーバーに送り、終わったら取り直して合わせる
 * - 操作を送っている間は、自動更新で画面を上書きしない
 */
export function useUserConsole() {
  const users = ref<UserListItemType[]>([])
  const status = ref<ConsoleStatus>('loading')
  const errorMessage = ref('') // 読み込みの失敗
  const actionError = ref('') // 操作の失敗 (画面は残したまま、メッセージだけ出す)
  const lastLoadedAt = ref(0)
  const autoRefresh = ref(true)

  let pending = 0
  let timer: ReturnType<typeof setInterval> | undefined

  const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

  const refresh = async () => {
    if (pending > 0) return
    try {
      const response = await userStatsApi.loadUsers()
      if (pending > 0) return // 取得中に操作が始まっていたら、古い内容で上書きしない
      users.value = response.users
      status.value = 'online'
      errorMessage.value = ''
      lastLoadedAt.value = Date.now()
    } catch (error) {
      if (error instanceof ConnectionError) {
        status.value = 'offline'
      } else {
        status.value = 'error'
        errorMessage.value = messageOf(error)
      }
    }
  }

  /** 画面を先に変えて、サーバーに送る。失敗したら、サーバーの内容に戻す */
  const mutate = async (applyLocally: () => void, request: () => Promise<unknown>) => {
    pending += 1
    actionError.value = ''
    applyLocally()
    try {
      await request()
    } catch (error) {
      actionError.value = messageOf(error)
    } finally {
      pending -= 1
    }
    await refresh()
  }

  const patchUser = (userId: string, patch: Partial<UserListItemType>) => {
    users.value = users.value.map((u) => (u.userId === userId ? { ...u, ...patch } : u))
  }
  const find = (userId: string) => users.value.find((u) => u.userId === userId)

  const sendUpdates = async (updates: UserStatsUpdateType[]) => {
    for (const chunk of chunkUpdates(updates)) await userStatsApi.updateUserStats(chunk)
  }

  // --- 操作 ---

  /** 得点を加算 (マイナスで減算)。サーバー側で加算するので、複数の操作元から同時に加点しても取りこぼさない */
  const addScore = (userId: string, delta: number) =>
    mutate(
      () => patchUser(userId, { score: (find(userId)?.score ?? 0) + delta }),
      () => sendUpdates([{ userId, addScore: delta }])
    )

  const setScore = (userId: string, score: number) =>
    mutate(
      () => patchUser(userId, { score }),
      () => sendUpdates([{ userId, set: { score } }])
    )

  const setTeam = (userId: string, team: DaisyUIColorType | null) =>
    mutate(
      () => patchUser(userId, { team }),
      () => sendUpdates([{ userId, set: { team } }])
    )

  /** 席順を設定する。0 を送ると席順なし (null) になる */
  const setOrder = (userId: string, order: number) =>
    mutate(
      () => patchUser(userId, { order: order === 0 ? null : order }),
      () => sendUpdates([{ userId, set: { order } }])
    )

  /** 画面に出ている並びを、席順 (1, 2, 3, ...) にする */
  const applyOrders = (visibleUsers: UserListItemType[]) => {
    const updates = buildOrderUpdates(visibleUsers)
    const orderOf = new Map(updates.map((u) => [u.userId, u.set!.order!]))
    return mutate(
      () => (users.value = users.value.map((u) => (orderOf.has(u.userId) ? { ...u, order: orderOf.get(u.userId)! } : u))),
      () => sendUpdates(updates)
    )
  }

  /** 画面に出ているユーザーの席順を外す */
  const clearOrders = (visibleUsers: UserListItemType[]) => {
    const updates = buildClearOrderUpdates(visibleUsers)
    const targets = new Set(updates.map((u) => u.userId))
    return mutate(
      () => (users.value = users.value.map((u) => (targets.has(u.userId) ? { ...u, order: null } : u))),
      () => sendUpdates(updates)
    )
  }

  const addManualUser = (userName: string) =>
    mutate(
      () => undefined, // 追加したユーザーの userId はサーバーが決めるので、画面は取り直して反映する
      () => userStatsApi.addManualUser(userName)
    )

  const removeManualUser = (userId: string) =>
    mutate(
      () => (users.value = users.value.filter((u) => u.userId !== userId)),
      () => userStatsApi.removeManualUser(userId)
    )

  /** コメント由来のユーザーを空にする (手動の操作結果と手動ユーザーは残る) */
  const resetCommentUsers = () =>
    mutate(
      () => (users.value = users.value.filter((u) => u.isManual)),
      () => userStatsApi.resetUsers()
    )

  onMounted(() => {
    void refresh()
    timer = setInterval(() => {
      if (autoRefresh.value && !document.hidden) void refresh()
    }, REFRESH_INTERVAL_MS)
  })
  onBeforeUnmount(() => timer && clearInterval(timer))

  return {
    users,
    status,
    errorMessage,
    actionError,
    lastLoadedAt,
    autoRefresh,
    refresh,
    addScore,
    setScore,
    setTeam,
    setOrder,
    applyOrders,
    clearOrders,
    addManualUser,
    removeManualUser,
    resetCommentUsers,
  }
}
