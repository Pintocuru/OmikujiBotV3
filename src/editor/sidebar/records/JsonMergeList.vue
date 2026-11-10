<!-- src/editor/sidebar/records/JsonMergeList.vue -->
<template>
  <div>
    <RecordItem
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :isSelected="selectedItemKey === item.key"
      @select="navigationStore.selectItem(item.key)"
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
  const { selectedItemKey } = storeToRefs(navigationStore)
</script>
