<!-- src/console/users/components/UserAddRemove.vue -->
<!-- ユーザー追加・消去: 手動でユーザーを追加 / コメントしたユーザーを空にする / (開発用) テストユーザー追加 -->
<template>
  <div class="flex flex-wrap items-center gap-2 rounded-box bg-base-200 p-3">
    <!-- 手動でユーザーを追加 (コメントしない ROM 勢など) -->
    <span class="text-sm font-bold">{{ usersMessages.addRemove.title }}</span>
    <input
      v-model="newUserName"
      type="text"
      maxlength="50"
      :placeholder="usersMessages.addRemove.placeholder"
      class="input input-sm input-bordered w-56"
      @keydown.enter="addUser"
    />
    <button class="btn btn-sm btn-primary" :disabled="newUserName.trim() === ''" @click="addUser">
      {{ usersMessages.addRemove.add }}
    </button>

    <div class="ml-auto flex flex-wrap gap-2">
      <button class="btn btn-sm btn-outline btn-warning" @click="confirmReset">
        {{ usersMessages.addRemove.reset }}
      </button>
      <!-- 開発サーバー専用: 開発サーバーにはコメントが来ないので、空にしたあとはここからユーザーを増やす -->
      <button
        v-if="isDev"
        class="btn btn-sm btn-outline btn-accent"
        :disabled="addingMock"
        :title="usersMessages.addRemove.mockTitle"
        @click="emit('addMock')"
      >
        {{ usersMessages.addRemove.mock }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { isDev } from '@/types/env'
  import { usersMessages } from '../maps/UsersMessageMap'

  defineProps<{ addingMock: boolean }>()
  const emit = defineEmits<{ add: [userName: string]; reset: []; addMock: [] }>()

  const newUserName = ref('')

  const addUser = () => {
    const name = newUserName.value.trim()
    if (name === '') return
    newUserName.value = ''
    emit('add', name)
  }

  const confirmReset = async () => {
    const result = await swalModal.confirm({
      icon: 'warning',
      title: usersMessages.confirm.resetTitle,
      text: usersMessages.confirm.resetText,
      confirmButtonText: usersMessages.confirm.resetButton,
    })
    if (result.isConfirmed) emit('reset')
  }
</script>
