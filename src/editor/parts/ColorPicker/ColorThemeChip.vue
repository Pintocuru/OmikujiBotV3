<!-- src/editor/parts/ColorPicker/ColorThemeChip.vue -->
<template>
  <div class="relative group">
    <button
      type="button"
      class="w-full rounded-lg border border-base-content/20 p-1.5 flex flex-col gap-1 text-left hover:scale-105 transition"
      :style="{ background: theme.background }"
      :title="title"
      @click="emit('select')"
    >
      <span class="text-[10px] font-bold leading-none truncate" :style="{ color: theme.name }">Name</span>
      <span class="text-xs leading-none" :style="{ color: theme.text }">Aa</span>
      <span class="h-1 w-full rounded-full" :style="{ background: theme.accent }" />
    </button>

    <button
      type="button"
      class="absolute -top-1 -right-1 rounded-full bg-base-100 border border-base-content/20 p-0.5 transition"
      :class="favorite ? 'opacity-100 text-warning' : 'opacity-0 group-hover:opacity-100 text-base-content/60'"
      :title="favoriteTitle"
      @click.stop="emit('toggleFavorite')"
    >
      <Star class="w-3 h-3" :fill="favorite ? 'currentColor' : 'none'" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { Star } from 'lucide-vue-next'
  import type { ColorSet } from './presets'

  defineProps<{
    theme: ColorSet
    title?: string
    favorite: boolean
    favoriteTitle?: string
  }>()

  const emit = defineEmits<{
    select: []
    toggleFavorite: []
  }>()
</script>
