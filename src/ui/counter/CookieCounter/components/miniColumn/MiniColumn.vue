<!-- src/ui/counter/CookieCounter/components/miniColumn/MiniColumn.vue -->
<template>
  <MiniCounterList direction="column" v-bind="props" />
</template>

<script setup lang="ts">
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import MiniCounterList from '../../parts/MiniCounterList.vue'

  const props = defineProps<{
    keys: string[]
    counters: Record<string, number>
    variableLabels: Record<string, string>
    colors: CharacterColorType[]
  }>()
</script>
