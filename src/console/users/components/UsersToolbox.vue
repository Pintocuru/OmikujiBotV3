<!-- src/console/users/components/UsersToolbox.vue -->
<!-- ツールボックス: 検索・並び替え・チームの数・チームでの絞り込み・チーム名の編集ボタン -->
<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-4">
      <!-- 名前検索ボックス -->
      <input
        v-model="query"
        type="search"
        :placeholder="usersMessages.toolbox.searchPlaceholder"
        class="input input-sm input-bordered"
      />

      <!-- ソート -->
      <ul tabindex="0" class="dropdown-content bg-base-100 flex gap-1">
        <li v-for="(label, key) in userSortLabels" :key="key" class="list-none">
          <a @click="sortKey = key" class="badge cursor-pointer" :class="{ 'badge-primary': sortKey === key }">
            {{ label }}
          </a>
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <!-- チーム増設 -->
      <span class="text-sm">{{ usersMessages.toolbox.team }}</span>
      <div class="w-full max-w-xs">
        <input type="range" class="range range-sm" min="0" max="8" step="1" v-model.number="teamCount" />
        <div class="mt-2 flex justify-between px-2.5 text-xs">
          <span>{{ usersMessages.toolbox.teamNone }}</span>
          <span v-for="n in 8" :key="n">{{ n }}</span>
        </div>
      </div>

      <template v-if="teams.length > 0">
        <!-- チーム名の編集 (ダイアログを開く) -->
        <button
          class="btn btn-ghost btn-xs"
          :title="usersMessages.toolbox.teamNameEditTitle"
          @click="emit('editTeamNames')"
        >
          ✎ {{ usersMessages.toolbox.teamNameEdit }}
        </button>

        <!-- チームごとの並び替え -->
        <select v-model="teamFilter" class="select select-sm">
          <option value="all">{{ usersMessages.toolbox.filterAll }}</option>
          <option value="none">{{ usersMessages.toolbox.filterNone }}</option>
          <option v-for="team in teams" :key="team" :value="team">{{ teamLabel(team) }}</option>
        </select>
      </template>
      <span class="text-sm opacity-60">{{ usersMessages.toolbox.userCount(visibleCount, totalCount) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { TeamCountType, TeamFilter, UserSortKey } from '@/console/types'
  import type { DaisyUIColorType } from '@/types/core'
  import { userSortLabels } from '../maps/UserSortMap'
  import { usersMessages } from '../maps/UsersMessageMap'

  defineProps<{
    teams: readonly DaisyUIColorType[]
    teamLabel: (team: DaisyUIColorType) => string
    visibleCount: number
    totalCount: number
  }>()
  const query = defineModel<string>('query', { required: true })
  const sortKey = defineModel<UserSortKey>('sortKey', { required: true })
  const teamFilter = defineModel<TeamFilter>('teamFilter', { required: true })
  const teamCount = defineModel<TeamCountType>('teamCount', { required: true })
  const emit = defineEmits<{ editTeamNames: [] }>()
</script>
