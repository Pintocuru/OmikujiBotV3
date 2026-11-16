<!-- src/ui/user/LabelMaker/LabelMaker.vue -->
<!-- 投稿で届いたユーザーを、名前ラベルのリストとして表示する (表示はコンポーネントで選ぶ) -->
<template>
  <LabelMakerSelector :users="users" :settings="settings" :fontFamily="appStore.data.ui.fontFamily" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { LabelMakerSchema } from '@/types/ui'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import LabelMakerSelector from './LabelMakerSelector.vue'
  import { useLabelMakerUsers } from './composables/useLabelMakerUsers'

  const appStore = useAppStore()
  const users = useLabelMakerUsers()

  const settings = computed(() => LabelMakerSchema.parse(appStore.data.ui?.settings?.labelMaker ?? {}))
</script>
