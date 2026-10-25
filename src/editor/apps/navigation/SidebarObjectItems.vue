<!-- src/editor/apps/navigation/SidebarObjectItems.vue -->
<!--
  appInfo / ui 用のセクションリスト。
  activeSection は SidebarSectionList の props として渡す必要があるため
  useSidebarContext() から取得して中継する。
-->
<template>
  <SidebarSectionList
    :category="category"
    :sections="sections"
    :activeSection="activeSection"
    @selectSection="(section) => (navigationStore.activeSection = section)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { SidebarObjectCategory } from '@/editor/types/apps'
  import { useSidebarContext } from './composables/useSidebarContext'
  import { useSidebarSubItems } from './composables/useSidebarSubItems'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import SidebarSectionList from './SidebarSectionList.vue'

  const props = defineProps<{
    category: SidebarObjectCategory
  }>()

  const { activeSection } = useSidebarContext()
  const { getObjectSections } = useSidebarSubItems()
  const navigationStore = useNavigationStore()

  // ui / appInfo どちらも ComputedRef で返る。category の変化にも追従させる
  const sections = computed(() => getObjectSections(props.category).value)
</script>
