<!-- src/ui/UserBoard/UserBoard.vue -->
<!-- LiveConsole で操作した、ユーザーの得点・チーム・席順を表示する -->
<template>
  <UserBoardSelector :users="users" :settings="settings" :fontFamily="appStore.data.ui.fontFamily" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserBoardSchema } from '@/types/ui'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import UserBoardSelector from './UserBoardSelector.vue'
  import { useUserStatsList } from './composables/useUserStatsList'

  const appStore = useAppStore()
  const users = useUserStatsList()

  const settings = computed(() => UserBoardSchema.parse(appStore.data.ui?.settings?.userBoard ?? {}))
</script>
