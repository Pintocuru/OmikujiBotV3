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
      @click="onClick(sec)"
    >
      <component :is="resolveLucideIcon(sec.icon)" class="w-3 h-3 shrink-0" />
      <span class="truncate">{{ t(`categorySections.${sec.section}.label`) }}</span>
    </button>

    <!-- Hover Popup：セクションの現在の設定内容をプレビューする -->
    <HoverPopup :x="popupX" :y="popupY" :visible="!!previewComponent && !!hoveredItem">
      <component :is="previewComponent" v-if="previewComponent" v-bind="previewProps" />
    </HoverPopup>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onBeforeUnmount } from 'vue'
  import { SidebarSectionItem } from '@/editor/types/apps'
  import HoverPopup from '../preview/HoverPopup.vue'
  import { staticSectionPreviewMap } from '../preview/staticSectionPreviewMap'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
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
  const HOVER_DELAY_MS = 120
  const hoveredSection = ref<SidebarSectionItem | null>(null)
  const popupX = ref(0)
  const popupY = ref(0)

  let timer: number | undefined

  const onEnter = (e: MouseEvent, sec: SidebarSectionItem) => {
    clearTimeout(timer)

    // ボタンの右端に出す（サイドバーに被らず、ボタンの高さに揃う）
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    popupX.value = rect.right
    popupY.value = rect.top - 12 // HoverPopup 側の OFFSET(12) を打ち消し、ボタン上端に揃える

    timer = window.setTimeout(() => {
      hoveredSection.value = sec
    }, HOVER_DELAY_MS)
  }

  const onLeave = () => {
    clearTimeout(timer)
    hoveredSection.value = null
  }

  const onClick = (sec: SidebarSectionItem) => {
    onLeave()
    emit('selectSection', sec.section)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  // プレビュー対象のデータ
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

  // プレビュー用コンポーネント（マップに無いセクション（limits 等）は何も出さない）
  const previewComponent = computed(() => {
    const name = hoveredSection.value?.component
    return name ? (staticSectionPreviewMap[name] ?? null) : null
  })

  // TriggerPreview は mode に 'services' | 'reactions' を要求する。
  // ThresholdPreview の mode は別の意味（threshold | criteria）なので、それ以外のカテゴリでは渡さない
  const previewProps = computed(() => {
    const isTriggerMode = props.category === 'services' || props.category === 'reactions'
    return isTriggerMode ? { data: hoveredItem.value, mode: props.category } : { data: hoveredItem.value }
  })
</script>
