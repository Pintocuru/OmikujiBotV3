<!-- src/ui/ToastWidgets/layouts/Simple.vue -->
<template>
  <div class="flex items-end gap-2 my-1" :class="showToastsOnRight ? 'flex-row-reverse' : 'flex-row'">
    <!-- アイコン -->
    <div v-if="iconLayers?.length" class="shrink-0 w-10 h-10">
      <CharacterLayerImage :layers="iconLayers" :size="10" :color="color" />
    </div>

    <!-- メッセージ -->
    <div class="max-w-xs rounded-full px-4 py-1.5 shadow-md" :style="{ backgroundColor: color.background, color: color.text }">
      <div class="leading-tight text-base" v-html="displayedHtml" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'
  import { resolveIconPlaceholders } from '@/ui/common/useFilteredBotMessages'

  const props = defineProps<{
    message: string
    color: CharacterColorType
    iconLayers?: string[]
    showToastsOnRight: boolean
    getProfileImage?: (userId: string) => string | undefined
  }>()

  const displayedHtml = computed(() => resolveIconPlaceholders(props.message, props.getProfileImage, 6))
</script>
