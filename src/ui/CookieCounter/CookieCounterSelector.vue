<!-- src/ui/CookieCounter/CookieCounterSelector.vue -->
<template>
  <div class="w-full bg-base-100 transparent-bg">
    <component
      :is="currentItem"
      :counters="counters"
      :counter-defs="settings.counters"
      :variable-labels="variableLabels"
      :color="settings.color"
      :images="settings.images"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { CookieComponent, CookieCounterType } from '@/types/ui'
  import Sakura from './layouts/Sakura.vue'
  import Block3d from './layouts/Block3d.vue'

  const props = defineProps<{
    settings: CookieCounterType
    counters: Record<string, number>
    variableLabels: Record<string, string>
  }>()

  const itemMap: Record<CookieComponent, Component> = {
    sakura: Sakura,
    block3d: Block3d,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? Sakura)
</script>
