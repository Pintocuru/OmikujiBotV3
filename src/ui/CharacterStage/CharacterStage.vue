<!-- src/ui/CharacterStage/CharacterStage.vue -->
<template>
  <div class="relative pointer-events-none z-10 h-screen w-screen overflow-hidden">
    <CharacterStageLayer :items="items" @remove="remove" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterStageSchema } from '@/types/ui'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import CharacterStageLayer from './CharacterStageLayer.vue'
  import { useCharacterStage } from './useCharacterStage'

  const appStore = useAppStore()

  // 設定（未設定ならスキーマの既定値）
  const settings = computed(() => CharacterStageSchema.parse(appStore.data.ui.settings.characterStage ?? {}))

  const { items, remove } = useCharacterStage(settings)
</script>
