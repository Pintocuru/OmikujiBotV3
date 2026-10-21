<!-- src/ui/KujibikiPanel/KujibikiPanelSelector.vue -->
<template>
  <MotionWrapper v-if="hasMessage" :key="currentKey" :visible="true" :motion="settings.animation" class="w-full">
    <component
      :is="currentComponent"
      :messages="messages"
      :label="settings.label"
      :imagePath="settings.imagePath"
      :iconSize="settings.iconSize"
    />
  </MotionWrapper>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { KujibikiComponent, KujibikiPanelType } from '@/types/ui'
  import { BotMessageBubbleType } from '@/generator/types'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import omikuji from './layouts/omikuji.vue'
  import flower from './layouts/flower.vue'
  import tarot from './layouts/tarot.vue'
  import faceCutout from './layouts/faceCutout.vue'

  const props = defineProps<{
    settings: KujibikiPanelType
    messages: BotMessageBubbleType[]
  }>()

  const componentMap: Record<KujibikiComponent, Component> = {
    omikuji,
    flower,
    tarot,
    faceCutout,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? omikuji)

  const hasMessage = computed(() => props.messages.some((m) => !!m.bubble?.message))

  const currentKey = computed(() => {
    return `${props.messages[0]?.id ?? ''}-${props.settings.animation}`
  })
</script>
