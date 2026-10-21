<!-- src/editor/apps/navigation/SidebarArrayItems.vue -->
<template>
  <div>
    <SidebarSubItem
      v-for="item in items"
      :key="item.key"
      :category="category"
      :itemKey="item.key"
      :label="item.label"
      :isDragEnabled="false"
      :isSelected="selectedItemKey === item.key"
      :sections="[]"
      @select="navigationStore.selectItem(item.key)"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { SidebarArrayCategory, SidebarStaticItem } from '@/editor/types/apps'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import SidebarSubItem from './SidebarSubItem.vue'

  defineProps<{
    category: SidebarArrayCategory
    items: SidebarStaticItem[]
  }>()

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)
</script>
