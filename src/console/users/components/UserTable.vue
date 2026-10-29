<!-- src/console/users/components/UserTable.vue -->
<template>
  <p v-if="users.length === 0" class="py-8 text-center opacity-60">{{ usersMessages.table.noMatch }}</p>
  <div v-else class="overflow-x-auto">
    <table class="table table-sm">
      <thead>
        <tr>
          <th class="w-10" />
          <th>{{ usersMessages.table.user }}</th>
          <th v-if="teams.length > 0">{{ usersMessages.table.team }}</th>
          <th class="text-right">{{ usersMessages.table.score }}</th>
          <th class="w-10" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId" class="hover:bg-base-200">
          <!-- ピン留め (ピン留めしたユーザーは、常に先頭) -->
          <td>
            <button
              class="btn btn-ghost btn-xs btn-square"
              :class="user.pinned ? 'text-primary' : 'opacity-30'"
              :title="user.pinned ? usersMessages.table.pinOff : usersMessages.table.pinOn"
              @click="emit('setPinned', user.userId, !user.pinned)"
            >
              📌
            </button>
          </td>

          <!-- ユーザー -->
          <td>
            <div class="flex items-center gap-2">
              <img v-if="user.profileImage" :src="user.profileImage" alt="" class="h-6 w-6 rounded-full object-cover" />
              <span v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-base-300 text-xs">
                {{ user.userName.slice(0, 1) }}
              </span>
              <span class="truncate">{{ user.userName }}</span>
              <span v-if="user.isManual" class="badge badge-outline badge-sm">{{ usersMessages.table.manual }}</span>
              <span v-else class="text-xs opacity-50">{{ usersMessages.table.commentCount(user.commentCount) }}</span>
            </div>
          </td>

          <!-- チーム (チーム区分なしのときは列ごと隠す) -->
          <td v-if="teams.length > 0">
            <div class="flex items-center gap-1">
              <button
                v-for="team in teamsOf(user)"
                :key="team"
                class="h-5 w-5 rounded-full border-2"
                :class="[
                  TEAM_STYLE[team].solid,
                  user.team === team ? 'border-base-content' : 'border-transparent opacity-60',
                ]"
                :title="teamLabel(team)"
                @click="emit('setTeam', user.userId, user.team === team ? null : team)"
              />
            </div>
          </td>

          <!-- 得点 -->
          <td>
            <div class="flex items-center justify-end gap-1">
              <button
                v-for="delta in [-10, -1]"
                :key="delta"
                class="btn btn-xs"
                @click="emit('addScore', user.userId, delta)"
              >
                {{ delta }}
              </button>
              <input
                type="number"
                class="input input-xs input-bordered w-20 text-right font-mono"
                :value="user.score"
                @change="onScore(user, $event)"
              />
              <button
                v-for="delta in [1, 10]"
                :key="delta"
                class="btn btn-xs btn-primary"
                @click="emit('addScore', user.userId, delta)"
              >
                +{{ delta }}
              </button>
            </div>
          </td>

          <!-- 削除 (手動ユーザーのみ) -->
          <td>
            <button
              v-if="user.isManual"
              class="btn btn-ghost btn-xs btn-square"
              :title="usersMessages.table.remove"
              @click="confirmRemove(user)"
            >
              ✕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import type { UserListItemType } from '@/types/api'
  import type { DaisyUIColorType } from '@/types/core'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { usersMessages } from '../maps/UsersMessageMap'
  import { TEAM_STYLE } from '../scripts/userConsole'

  const props = defineProps<{
    users: UserListItemType[]
    teams: readonly DaisyUIColorType[]
    teamLabel: (team: DaisyUIColorType) => string
  }>()

  const emit = defineEmits<{
    addScore: [userId: string, delta: number]
    setScore: [userId: string, score: number]
    setTeam: [userId: string, team: DaisyUIColorType | null]
    setPinned: [userId: string, pinned: boolean]
    remove: [userId: string]
  }>()

  // 使っていないチームに割り当て済みのユーザーは、そのチームのボタンも出す (割り当てが見えなくならないように)
  const teamsOf = (user: UserListItemType): readonly DaisyUIColorType[] =>
    user.team !== null && !props.teams.includes(user.team) ? [...props.teams, user.team] : props.teams

  const numberOf = (event: Event): number | null => {
    const value = (event.target as HTMLInputElement).value
    return value.trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : null
  }

  const onScore = (user: UserListItemType, event: Event) => {
    const score = numberOf(event)
    if (score === null)
      (event.target as HTMLInputElement).value = String(user.score) // 空や不正な値は、元に戻す
    else if (score !== user.score) emit('setScore', user.userId, score)
  }

  const confirmRemove = async (user: UserListItemType) => {
    const result = await swalModal.confirmDelete({
      title: usersMessages.confirm.removeTitle(user.userName),
      text: usersMessages.confirm.removeText,
    })
    if (result.isConfirmed) emit('remove', user.userId)
  }
</script>
