<!-- src/ui/ToastWidgets/ToastBubbleSelector.vue -->
<template>
  <component
    :is="currentComponent"
    :message="message"
    :color="color"
    :iconLayers="iconLayers"
    :showToastsOnRight="settings.showToastsOnRight"
    :getProfileImage="getProfileImage"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { ToastComponent, ToastWidgetsType } from '@/types/ui'
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import standard from './layouts/Standard.vue'
  import simple from './layouts/Simple.vue'
  import card from './layouts/Card.vue'

  const props = defineProps<{
    settings: ToastWidgetsType
    message: string
    color: CharacterColorType
    iconLayers?: string[]
    getProfileImage?: (userId: string) => string | undefined
  }>()

  const componentMap: Record<ToastComponent, any> = {
    standard,
    simple,
    card,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] || standard)
</script>
