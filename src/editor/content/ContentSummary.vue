<!-- src/editor/content/ContentSummary.vue -->
<!-- Events / Assets 用の概要。基本設定(BaseSummary)と、使うキャラクター(CharacterSummary)を並べる -->
<template>
  <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
    <BaseSummary :class="{ 'md:col-span-2': !hasCharacters }" />
    <CharacterSummary v-if="hasCharacters" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import BaseSummary from './summary/BaseSummary.vue'
  import CharacterSummary from './summary/CharacterSummary.vue'

  const { selectedCategory } = storeToRefs(useNavigationStore())

  // キャラクター自身は、キャラクターを「使う側」ではないので、使用キャラクターを出さない
  const hasCharacters = computed(() => selectedCategory.value !== 'characters')
</script>
