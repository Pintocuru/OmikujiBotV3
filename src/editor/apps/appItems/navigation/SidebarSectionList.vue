<!-- src/editor/apps/appItems/navigation/SidebarSectionList.vue -->
<template>
  <div class="relative">
    <button
      v-for="sec in sections"
      :key="sec.section"
      class="w-full flex items-center gap-1.5 pl-6 pr-2 py-0.5 text-xs rounded hover:bg-base-300 cursor-pointer"
      :class="activeSection === sec.section ? ` font-semibold` : 'opacity-60'"
      @mouseenter="onEnter($event, sec)"
      @mouseleave="onLeave"
      @click="emit('selectSection', sec.section)"
    >
      <component :is="resolveIcon(sec.icon)" v-if="sec.icon" class="w-3 h-3 shrink-0" />
      <span class="truncate">{{ t(`categorySections.${sec.section}.label`) }}</span>
    </button>

    <!-- TODO:実装 Hover Popup
    <HoverPopup v-if="hoveredSection?.component" :x="mouseX" :y="mouseY" :visible="!!hoveredSection">
      <component :is="staticSectionPreviewMap[hoveredSection.component]" :data="hoveredItem" :mode="category" />
    </HoverPopup> -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { SidebarSectionItem } from '@/editor/maps/category/CategorySectionMap.js'
  // import HoverPopup from '../preview/HoverPopup.vue'
  // import { staticSectionPreviewMap } from '../preview/staticSectionPreviewMap.js'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon.js'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { CategoryType } from '@/types/OmikujiData'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps<{
    category: CategoryType
    itemKey?: string
    sections: SidebarSectionItem[]
    activeSection: string | null
  }>()

  const emit = defineEmits<{
    selectSection: [section: string]
  }>()

  const { getEvent, isEventCategory } = useGetEventData()
  const { getAsset, isAssetCategory } = useGetAssetData()

  // hover state
  const hoveredSection = ref<SidebarSectionItem | null>(null)
  const mouseX = ref(0)
  const mouseY = ref(0)

  let timer: number

  const onEnter = (e: MouseEvent, sec: SidebarSectionItem) => {
    clearTimeout(timer)

    mouseX.value = e.clientX
    mouseY.value = e.clientY

    timer = window.setTimeout(() => {
      hoveredSection.value = sec
    }, 120)
  }

  const onLeave = () => {
    clearTimeout(timer)
    hoveredSection.value = null
  }

  // ★ データ取得（computedでシンプルに）
  const hoveredItem = computed(() => {
    if (!props.itemKey) return null

    if (isEventCategory(props.category)) {
      return getEvent(props.category, props.itemKey)
    }

    if (isAssetCategory(props.category)) {
      return getAsset(props.category, props.itemKey)
    }

    return null
  })

  function resolveIcon(name?: string) {
    if (!name) return null
    return resolveLucideIcon(name as LucideIconName)
  }
</script>
