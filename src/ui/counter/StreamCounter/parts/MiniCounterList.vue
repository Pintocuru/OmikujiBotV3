<!-- src/ui/counter/StreamCounter/parts/MiniCounterList.vue -->
<template>
  <div class="flex w-fit gap-0.5" :class="direction === 'column' ? 'flex-col items-start' : 'flex-row flex-wrap items-center'">
    <div
      v-for="item in items"
      :key="item.key"
      class="inline-flex items-center gap-0.5 rounded px-1 py-px leading-none whitespace-nowrap"
      :style="{ backgroundColor: item.color.background }"
    >
      <component :is="item.label" v-if="isComponent(item.label)" class="size-3.5 shrink-0" :style="{ color: item.color.name }" />
      <span v-else class="text-xs font-bold" :style="{ color: item.color.name }">{{ item.label }}</span>
      <span class="text-sm font-bold" :style="{ color: item.color.text }">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRef } from 'vue'
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import { formatCounterValue, pickCounterColor } from '../composables/useStreamCounterDisplay'
  import { useLabelResolver, type LabelStyle } from '../composables/useLiverLabelResolver'

  const props = defineProps<{
    direction: 'column' | 'row'
    keys: string[]
    counters: Record<string, number>
    variableLabels: Record<string, string>
    colors: CharacterColorType[]
  }>()

  const { getLabel, isComponent } = useLabelResolver(toRef(props, 'variableLabels'), ref<LabelStyle>('lucide'))

  const items = computed(() =>
    props.keys.map((key, index) => ({
      key,
      label: getLabel(key),
      color: pickCounterColor(props.colors, index),
      value: formatCounterValue(props.counters[key] ?? 0),
    }))
  )
</script>
