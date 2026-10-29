<!-- src/console/users/components/TeamNameDialog.vue -->
<!-- チーム名を編集するダイアログ (チーム色ごとに、名前を付ける) -->
<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-sm">
      <h3 class="text-lg font-bold">{{ usersMessages.teamNameDialog.title }}</h3>
      <p class="py-2 text-xs opacity-60">{{ usersMessages.teamNameDialog.description }}</p>

      <ul class="flex flex-col gap-2">
        <li v-for="team in teams" :key="team" class="flex items-center gap-2">
          <span class="h-5 w-5 shrink-0 rounded-full" :class="TEAM_STYLE[team].solid" />
          <input
            v-model="draft[team]"
            type="text"
            class="input input-sm input-bordered grow"
            :maxlength="usersMessages.teamNameDialog.maxLength"
            :placeholder="defaultTeamName(team)"
            @keydown.enter="save"
          />
        </li>
      </ul>

      <div class="modal-action">
        <button class="btn btn-ghost btn-sm mr-auto" @click="resetDraft">
          {{ usersMessages.teamNameDialog.reset }}
        </button>
        <button class="btn btn-sm" @click="close">{{ usersMessages.teamNameDialog.cancel }}</button>
        <button class="btn btn-primary btn-sm" @click="save">{{ usersMessages.teamNameDialog.save }}</button>
      </div>
    </div>
    <!-- 外側をクリックしたら閉じる -->
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { DaisyUIColorType } from '@/types/core'
  import { usersMessages } from '../maps/UsersMessageMap'
  import { defaultTeamName, TEAM_STYLE } from '../scripts/userConsole'

  const props = defineProps<{
    teams: readonly DaisyUIColorType[]
    teamLabel: (team: DaisyUIColorType) => string
  }>()
  const emit = defineEmits<{ save: [names: Partial<Record<DaisyUIColorType, string>>] }>()

  const dialogRef = ref<HTMLDialogElement>()
  const draft = ref<Partial<Record<DaisyUIColorType, string>>>({})

  // 初期の名前のままのチームは、保存しない (空欄 = 初期の名前)
  const loadDraft = () => {
    draft.value = Object.fromEntries(props.teams.map((team) => [team, props.teamLabel(team)]))
  }
  const resetDraft = () => {
    draft.value = Object.fromEntries(props.teams.map((team) => [team, '']))
  }

  const open = () => {
    loadDraft()
    dialogRef.value?.showModal()
  }
  const close = () => dialogRef.value?.close()
  const save = () => {
    const names: Partial<Record<DaisyUIColorType, string>> = {}
    for (const team of props.teams) {
      const value = (draft.value[team] ?? '').trim()
      names[team] = value === defaultTeamName(team) ? '' : value
    }
    emit('save', names)
    close()
  }

  defineExpose({ open })
</script>
