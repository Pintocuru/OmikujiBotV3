<!-- src/ui/comment/UserComment/UserComment.vue -->
<!-- おみくじが反応したコメントと、その結果をレス風に並べて表示する -->
<template>
  <UserCommentList :entries="entries" :fontFamily="appStore.data.ui.fontFamily" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserCommentSchema } from '@/types/ui'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { useFilteredBotMessages } from '@/ui/common/useFilteredBotMessages'
  import UserCommentList from './UserCommentList.vue'
  import { buildEntries } from './scripts/userCommentEntries'

  const appStore = useAppStore()
  const settings = computed(() => UserCommentSchema.parse(appStore.data.ui?.settings?.userComment ?? {}))

  // uiKey が userComment のメッセージだけが届く(結果が空のものは除かれる)
  const { messages } = useFilteredBotMessages('userComment', { userIconSize: 6 })

  const entries = computed(() => buildEntries(messages.value, settings.value))
</script>
