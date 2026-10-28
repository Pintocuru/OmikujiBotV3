<!-- src/console/users/components/UserTable.vue -->
<template>
  <p v-if="users.length === 0" class="py-8 text-center opacity-60">該当するユーザーがいません</p>
  <div v-else class="overflow-x-auto">
    <table class="table table-sm">
      <thead>
        <tr>
          <th class="w-20">席順</th>
          <th>ユーザー</th>
          <th v-if="teams.length > 0">チーム</th>
          <th class="text-right">得点</th>
          <th class="w-10" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId" class="hover:bg-base-200">
          <!-- 席順 -->
          <td>
            <input
              type="number"
              min="0"
              class="input input-xs input-bordered w-16"
              :value="user.order ?? ''"
              placeholder="なし"
              title="空欄か 0 で、席順なし"
              @change="onOrder(user, $event)"
            />
          </td>

          <!-- ユーザー -->
          <td>
            <div class="flex items-center gap-2">
              <img v-if="user.profileImage" :src="user.profileImage" alt="" class="h-6 w-6 rounded-full object-cover" />
              <span v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-base-300 text-xs">
                {{ user.userName.slice(0, 1) }}
              </span>
              <span class="truncate">{{ user.userName }}</span>
              <span v-if="user.isManual" class="badge badge-outline badge-sm">手動</span>
              <span v-else class="text-xs opacity-50">{{ user.commentCount }}回</span>
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
                :title="TEAM_STYLE[team].label"
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
              title="このユーザーを削除"
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
  import { TEAM_STYLE } from '../scripts/userConsole'

  const props = defineProps<{ users: UserListItemType[]; teams: readonly DaisyUIColorType[] }>()

  const emit = defineEmits<{
    addScore: [userId: string, delta: number]
    setScore: [userId: string, score: number]
    setTeam: [userId: string, team: DaisyUIColorType | null]
    setOrder: [userId: string, order: number]
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

  // 席順: 空欄または 0 で、席順なし (0 を送る)
  const onOrder = (user: UserListItemType, event: Event) => {
    const input = event.target as HTMLInputElement
    const order = input.value.trim() === '' ? 0 : numberOf(event)
    if (order === null || order < 0)
      input.value = user.order === null ? '' : String(user.order) // 不正な値は、元に戻す
    else if (order === 0 && user.order !== null) emit('setOrder', user.userId, 0)
    else if (order > 0 && Math.floor(order) !== user.order) emit('setOrder', user.userId, Math.floor(order))
  }

  const confirmRemove = (user: UserListItemType) => {
    if (window.confirm(`「${user.userName}」を削除します。得点などの記録も消えます。よろしいですか?`))
      emit('remove', user.userId)
  }
</script>
