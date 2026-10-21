<!-- src/ui/ToastWidgets/layouts/Card.vue -->
<template>
  <div class="flex items-center gap-3 my-1">
    <div
      class="flex items-center gap-3 max-w-xs rounded-lg px-3 py-2 shadow-lg"
      :class="showToastsOnRight ? 'flex-row-reverse border-r-4' : 'flex-row border-l-4'"
      :style="{ backgroundColor: color.background, color: color.text, borderColor: color.accent }"
    >
      <!-- アイコン -->
      <div v-if="iconLayers?.length" class="shrink-0 w-10 h-10">
        <CharacterLayerImage :layers="iconLayers" :size="10" :color="color" />
      </div>

      <!-- メッセージ -->
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
