<!-- src/ui/bot/ToastWidgets/components/standard/Standard.vue -->
<template>
  <div class="my-1 flex items-end gap-2" :class="showToastsOnRight ? 'flex-row-reverse' : 'flex-row'">
    <!-- アイコン -->
    <div v-if="iconLayers?.length" class="relative h-10 w-10 shrink-0">
      <CharacterLayerImage :layers="iconLayers" :size="10" :color="color" />
    </div>

    <!-- メッセージ -->
    <div
      class="max-w-xs rounded-lg px-3 py-2 shadow-md"
      :style="{ backgroundColor: color.background, color: color.text }"
    >
      <div class="text-base leading-tight" v-html="displayedHtml" />
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
