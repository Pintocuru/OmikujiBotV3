<!-- src/layout/common/KujibikiPanel/KujibikiPanel.vue -->
<template>
  <!-- 画像 -->
  <CharacterStage />
  <!-- おみくじパネル -->
  <div class="h-screen w-full flex items-center justify-center">
    <KujibikiPanel />
  </div>
</template>

<script setup lang="ts">
  import KujibikiPanel from '@/ui/bot/KujibikiPanel/KujibikiPanel.vue'
  import CharacterStage from '@/ui/bot/CharacterStage/CharacterStage.vue'
</script>
