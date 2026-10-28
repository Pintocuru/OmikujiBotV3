<!-- src/console/components/UsersView.vue -->
<!-- ユーザーの得点・チーム・席順を操作する画面 (OBS の表示に反映される) -->
<template>
  <div class="flex flex-col">
    <!-- ツールバー -->
    <div class="flex flex-wrap items-center justify-end gap-3 px-4 pt-3">
      <span class="badge" :class="statusBadge.class">{{ statusBadge.text }}</span>
      <span v-if="lastLoadedAt" class="hidden text-xs opacity-60 sm:inline">更新 {{ formatTime(lastLoadedAt) }}</span>
      <label class="label cursor-pointer gap-2 text-sm">
        <input v-model="autoRefresh" type="checkbox" class="toggle toggle-sm toggle-primary" />
        自動更新
      </label>
      <button class="btn btn-sm" @click="refresh">更新</button>
    </div>

    <StatusNotice :status="status" :errorMessage="errorMessage" />

    <main v-if="status === 'loading' || status === 'online'" class="mx-auto flex w-full max-w-6xl flex-col gap-3 p-4">
      <div v-if="actionError" class="alert alert-error py-2 text-sm">
        <span class="break-all">操作に失敗しました: {{ actionError }}</span>
      </div>

      <div v-if="mockError" class="alert alert-error py-2 text-sm">
        <span class="break-all">テスト用ユーザーを追加できませんでした: {{ mockError }}</span>
      </div>

      <TeamBars v-if="teams.length > 0" :totals="teamTotals" />

      <!-- 絞り込み・並び替え -->
      <div class="flex flex-wrap items-center gap-3">
        <input v-model="query" type="search" placeholder="名前で検索" class="input input-sm input-bordered w-44" />
        <select v-model="sortKey" class="select select-sm select-bordered">
          <option v-for="(label, key) in userSortLabels" :key="key" :value="key">{{ label }}</option>
        </select>
        <label class="flex items-center gap-1 text-sm">
          チーム
          <select v-model.number="teamCount" class="select select-sm select-bordered">
            <option v-for="count in teamCounts" :key="count" :value="count">{{ teamCountLabel(count) }}</option>
          </select>
        </label>
        <select v-if="teams.length > 0" v-model="teamFilter" class="select select-sm select-bordered">
          <option value="all">すべてのチーム</option>
          <option value="none">チームなし</option>
          <option v-for="team in teams" :key="team" :value="team">{{ TEAM_STYLE[team].label }}</option>
        </select>
        <span class="text-sm opacity-60">{{ visibleUsers.length }} / {{ users.length }}人</span>

        <div class="ml-auto flex flex-wrap gap-2">
          <button class="btn btn-sm" :disabled="visibleUsers.length === 0" @click="confirmApplyOrders">
            この並びを席順にする
          </button>
          <button
            class="btn btn-sm"
            :disabled="visibleUsers.every((u) => u.order === null)"
            @click="confirmClearOrders"
          >
            席順を外す
          </button>
          <button class="btn btn-sm btn-outline btn-warning" @click="confirmReset">コメントのユーザーを空にする</button>
          <!-- 開発サーバー専用: 開発サーバーにはコメントが来ないので、空にしたあとはここからユーザーを増やす -->
          <button
            v-if="isDev"
            class="btn btn-sm btn-outline btn-accent"
            :disabled="addingMock"
            title="開発用: コメントしたユーザーとして、テスト用のユーザーを追加します(本番では表示されません)"
            @click="addMockUsersAndRefresh"
          >
            🧪 テスト用ユーザーを追加
          </button>
        </div>
      </div>

      <!-- 手動でユーザーを追加 (コメントしない ROM 勢など) -->
      <div class="flex flex-wrap items-center gap-2 rounded-box bg-base-200 p-3">
        <span class="text-sm font-bold">ユーザーを追加</span>
        <input
          v-model="newUserName"
          type="text"
          maxlength="50"
          placeholder="名前(コメントしない人など)"
          class="input input-sm input-bordered w-56"
          @keydown.enter="addUser"
        />
        <button class="btn btn-sm btn-primary" :disabled="newUserName.trim() === ''" @click="addUser">追加</button>
      </div>

      <p v-if="status === 'loading'" class="py-8 text-center opacity-60">読み込み中...</p>
      <p v-else-if="users.length === 0" class="py-8 text-center opacity-60">
        まだユーザーがいません。コメントがあると、ここに増えていきます。コメントしない人は「ユーザーを追加」から入れられます。
      </p>
      <UserTable
        v-else
        :users="visibleUsers"
        :teams="teams"
        @addScore="addScore"
        @setScore="setScore"
        @setTeam="setTeam"
        @setOrder="setOrder"
        @remove="removeManualUser"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { isDev } from '@/types/env'

  import { TeamCountType, TeamFilter, teamCounts, UserSortKey, userSortLabels } from '@/console/types'
  import { useMockUsers } from '../composables/useMockUsers'
  import { useTeamCount } from '../composables/useTeamCount'
  import { useUserConsole } from '../composables/useUserConsole'
  import { formatTime } from '@/console/common/scripts/formatters'
  import { buildTeamTotals, filterUsers, sortUsers, TEAM_STYLE } from '../scripts/userConsole'
  import StatusNotice from '@/console/common/components/StatusNotice.vue'
  import TeamBars from './TeamBars.vue'
  import UserTable from './UserTable.vue'

  const {
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
  } = useUserConsole()

  // 開発サーバー専用: テスト用のユーザーを追加して、画面を取り直す
  const { adding: addingMock, mockError, addMockUsers } = useMockUsers()
  const addMockUsersAndRefresh = async () => {
    if (await addMockUsers()) await refresh()
  }

  const query = ref('')
  const sortKey = ref<UserSortKey>('recent')
  const teamFilter = ref<TeamFilter>('all')

  // チームの数 (0 = チーム区分なし)。使わなくなったチームで絞り込んだままにならないよう、「すべてのチーム」に戻す
  const { teamCount, teams } = useTeamCount()
  const teamCountLabel = (count: TeamCountType) => (count === 0 ? 'チーム区分なし' : `${count}チーム`)
  watch(teams, (value) => {
    if (teamFilter.value !== 'all' && teamFilter.value !== 'none' && !value.includes(teamFilter.value))
      teamFilter.value = 'all'
    if (value.length === 0) teamFilter.value = 'all'
  })
  const newUserName = ref('')

  const visibleUsers = computed(() =>
    sortUsers(filterUsers(users.value, { query: query.value, team: teamFilter.value }), sortKey.value)
  )
  const teamTotals = computed(() => buildTeamTotals(users.value, teams.value))

  const addUser = async () => {
    const name = newUserName.value.trim()
    if (name === '') return
    newUserName.value = ''
    await addManualUser(name)
  }

  // TODO: ダイアログは SweetAlert2 を使うこと。
  const confirmApplyOrders = () => {
    if (
      window.confirm(
        `いま表示している ${visibleUsers.value.length} 人を、この並びで席順 (1, 2, 3...) にします。よろしいですか?`
      )
    ) {
      void applyOrders(visibleUsers.value)
    }
  }

  const confirmClearOrders = () => {
    if (window.confirm('いま表示しているユーザーの席順を外します。よろしいですか?'))
      void clearOrders(visibleUsers.value)
  }

  const confirmReset = () => {
    if (
      window.confirm(
        'コメントしたユーザーの一覧を空にします。手動で追加したユーザーと、得点・チーム・席順は残ります(同じ人が次にコメントすると戻ります)。よろしいですか?'
      )
    ) {
      void resetCommentUsers()
    }
  }

  const statusBadge = computed(() => {
    switch (status.value) {
      case 'online':
        return { text: '接続中', class: 'badge-success' }
      case 'offline':
        return { text: '未接続', class: 'badge-warning' }
      case 'error':
        return { text: 'エラー', class: 'badge-error' }
      default:
        return { text: '読み込み中', class: 'badge-ghost' }
    }
  })
</script>
