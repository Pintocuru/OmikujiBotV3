<!-- src/ui/StreamCounter/editor/CounterSelector/CounterSelectorPanel.vue -->
<template>
  <!-- 標準カウンター -->
  <SettingItem
    label="標準カウンター"
    description="表示したい項目を選択してください"
    :showReset="true"
    @reset="emit('reset', 'default')"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in streamDefaultMap"
        :key="key"
        class="badge cursor-pointer"
        :class="isSelected('default', key) ? 'badge-primary' : 'badge-outline'"
        @click="toggleDefault(key, label)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- 評価ブロックカウンター -->
  <CounterVariableSection
    :counters="counters"
    :addDisabled="counterCount >= maxCounters"
    @add="emit('add', $event)"
    @remove="emit('remove', $event)"
    @update="emit('update', $event)"
  />

  <!-- 表示順 -->
  <CounterOrderSection
    :counters="counters"
    :maxCounters="maxCounters"
    @remove="emit('remove', $event)"
    @reorder="emit('reorder', $event)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { streamDefaultMap } from '@/types/ui'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import CounterVariableSection from './CounterVariableSection.vue'
  import CounterOrderSection from './CounterOrderSection.vue'
  import type { CounterItem } from './counterTypes'

  const props = defineProps<{
    counters: CounterItem[]
    maxCounters: number
  }>()

  const emit = defineEmits<{
    (e: 'add', item: Omit<CounterItem, 'id'>): void
    (e: 'remove', id: string): void
    (e: 'reset', type: 'default' | 'event'): void
    (e: 'reorder', items: CounterItem[]): void
    (e: 'update', payload: { id: string; patch: { target: string; label: string } }): void
  }>()

  const counterCount = computed(() => props.counters.length)

  const isSelected = (type: CounterItem['type'], target: string) =>
    props.counters.some((c) => c.type === type && c.target === target)

  const isDisabled = (type: CounterItem['type'], target: string) =>
    !isSelected(type, target) && counterCount.value >= props.maxCounters

  const toggleDefault = (target: string, label: string) => {
    const found = props.counters.find((c) => c.type === 'default' && c.target === target)
    if (found) {
      emit('remove', found.id)
    } else if (!isDisabled('default', target)) {
      emit('add', { type: 'default', target, label })
    }
  }
</script>
