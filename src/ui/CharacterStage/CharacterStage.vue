<!-- src/ui/CharacterStage/CharacterStage.vue -->
<template>
  <div class="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    <CharacterStageLayer :items="items" :muted="false" @remove="remove" />
  </div>
</template>

<script setup lang="ts">
  import CharacterStageLayer from './CharacterStageLayer.vue'
  import { useCharacterStage } from './useCharacterStage'

  const { items, remove } = useCharacterStage()
</script>
