// src/console/users/composables/useUserConsole.ts
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { userStatsApi } from '@/manager/services/userStatsApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import type { UserListItemType, UserStatsUpdateType } from '@/types/api'
import type { DaisyUIColorType } from '@/types/core'
import { chunkUpdates } from '../scripts/userConsole'
import { ConsoleStatus } from '@/console/types'

const REFRESH_INTERVAL_MS = 3000

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

  /** ピン留めを付ける / 外す (ピン留めしたユーザーは、ユーザーリストの先頭に固定される) */
  const setPinned = (userId: string, pinned: boolean) =>
    mutate(
      () => patchUser(userId, { pinned }),
      () => sendUpdates([{ userId, set: { pinned } }])
    )

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
    setPinned,
    addManualUser,
    removeManualUser,
    resetCommentUsers,
  }
}
