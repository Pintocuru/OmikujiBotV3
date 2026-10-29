<!-- src/console/users/UsersView.vue -->
<!-- ユーザーの得点・チーム・ピン留めを操作する画面 (OBS の表示に反映される) -->
<!-- 画面の部品: UsersToolbar / StatusNotice / UsersToolbox / UserAddRemove / UserTable。ここは組み立てと状態の受け渡しだけ -->
<template>
  <div class="flex flex-col">
    <!-- ツールバー -->
    <UsersToolbar v-model:autoRefresh="autoRefresh" :status="status" :lastLoadedAt="lastLoadedAt" @refresh="refresh" />

    <!-- 接続の状態表示 -->
    <StatusNotice :status="status" :errorMessage="errorMessage" />

    <main v-if="status === 'loading' || status === 'online'" class="mx-auto flex w-full max-w-6xl flex-col gap-3 p-4">
      <div v-if="actionError" class="alert alert-error py-2 text-sm">
        <span class="break-all">{{ usersMessages.errors.action(actionError) }}</span>
      </div>

      <div v-if="mockError" class="alert alert-error py-2 text-sm">
        <span class="break-all">{{ usersMessages.errors.mock(mockError) }}</span>
      </div>

      <!-- チームごとの得点 -->
      <TeamBars v-if="teams.length > 0" :totals="teamTotals" :teamLabel="teamLabel" />

      <!-- ツールボックス -->
      <UsersToolbox
        v-model:query="query"
        v-model:sortKey="sortKey"
        v-model:teamFilter="teamFilter"
        v-model:teamCount="teamCount"
        :teams="teams"
        :teamLabel="teamLabel"
        :visibleCount="visibleUsers.length"
        :totalCount="users.length"
        @editTeamNames="teamNameDialog?.open()"
      />

      <!-- ユーザー追加・消去 -->
      <UserAddRemove
        :addingMock="addingMock"
        @add="addManualUser"
        @reset="resetCommentUsers"
        @addMock="addMockUsersAndRefresh"
      />

      <!-- ユーザーリスト -->
      <p v-if="status === 'loading'" class="py-8 text-center opacity-60">{{ usersMessages.table.loading }}</p>
      <p v-else-if="users.length === 0" class="py-8 text-center opacity-60">{{ usersMessages.table.noUsers }}</p>
      <UserTable
        v-else
        :users="visibleUsers"
        :teams="teams"
        :teamLabel="teamLabel"
        @addScore="addScore"
        @setScore="setScore"
        @setTeam="setTeam"
        @setPinned="setPinned"
        @remove="removeManualUser"
      />
    </main>

    <!-- チーム名の編集ダイアログ -->
    <TeamNameDialog ref="teamNameDialog" :teams="teams" :teamLabel="teamLabel" @save="saveTeamNames" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { TeamFilter, UserSortKey } from '@/console/types'
  import StatusNotice from '@/console/common/components/StatusNotice.vue'
  import { useMockUsers } from './composables/useMockUsers'
  import { useTeamCount } from './composables/useTeamCount'
  import { useTeamNames } from './composables/useTeamNames'
  import { useUserConsole } from './composables/useUserConsole'
  import { usersMessages } from './maps/UsersMessageMap'
  import { buildTeamTotals, filterUsers, sortUsers } from './scripts/userConsole'
  import TeamBars from './components/TeamBars.vue'
  import TeamNameDialog from './components/TeamNameDialog.vue'
  import UserAddRemove from './components/UserAddRemove.vue'
  import UserTable from './components/UserTable.vue'
  import UsersToolbar from './components/UsersToolbar.vue'
  import UsersToolbox from './components/UsersToolbox.vue'

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
    setPinned,
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
  watch(teams, (value) => {
    if (teamFilter.value !== 'all' && teamFilter.value !== 'none' && !value.includes(teamFilter.value))
      teamFilter.value = 'all'
    if (value.length === 0) teamFilter.value = 'all'
  })

  // チーム名 (チーム色の名前は出さず、「チーム1」や、付けた名前を表示する)
  const { teamLabel, saveTeamNames } = useTeamNames()
  const teamNameDialog = ref<InstanceType<typeof TeamNameDialog>>()

  // ピン留めしたユーザーは、どの並びでも先頭 (sortUsers)
  const visibleUsers = computed(() =>
    sortUsers(filterUsers(users.value, { query: query.value, team: teamFilter.value }), sortKey.value)
  )
  const teamTotals = computed(() => buildTeamTotals(users.value, teams.value))
</script>
