<!-- src/editor/sidebar/records/JsonMergeList.vue -->
<template>
  <div>
    <RecordItem
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :isSelected="selectedCategory === 'jsonMerge' && selectedItemKey === item.key"
      @select="selectRecord(item.key)"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { SidebarStaticItem } from '@/editor/types/apps'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import RecordItem from './RecordItem.vue'

  defineProps<{
    items: SidebarStaticItem[]
  }>()

  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)

  const selectRecord = (key: string) => {
    navigationStore.selectCategory('jsonMerge')
    navigationStore.selectItem(key)
  }
</script>
