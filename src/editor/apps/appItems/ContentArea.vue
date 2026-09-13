<!-- src/editor/events/appItems/ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div id="section-Top" class="flex items-center justify-between px-4 py-3 bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-lg font-bold">
      <component :is="currentIcon" class="w-6 h-6" />
      {{ currentCategory.label }}
    </div>

    <div class="text-sm opacity-80">
      {{ currentCategory.description }}
    </div>
  </div>

  <component :is="currentEditor" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CategoryType } from '@/types/OmikujiData'
  import { categoryMap } from '@/maps/OmikujiData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import CommentEventEditor from '@/editor/events/comment/CommentEditor.vue'
  import TimerEventEditor from '@/editor/events/timer/TimerEditor.vue'
  import ServiceEventEditor from '@/editor/events/service/ServiceEditor.vue'
  import ReactionEventEditor from '@/editor/events/reaction/ReactionEditor.vue'

  import BoxEditor from '@/editor/assets/box/BoxEditor.vue'
  import ActionsEditor from '@/editor/assets/actions/ActionsEditor.vue'
  import PlaceholderEditor from '@/editor/assets/placeholders/PlaceholderEditor.vue'
  import CharacterEditor from '@/editor/assets/characters/CharacterEditor.vue'

  import UiEditor from '@/editor/UiEditor/UiEditor.vue'
  import AppInfoEditor from '@/editor/apps/appInfo/AppInfoEditor.vue'
  import JsonMergeEditor from '@/editor/apps/JsonMerge/JsonMergeEditor.vue'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)

  const currentCategory = computed(() => categoryMap[selectedCategory.value])
  const currentIcon = computed(() => resolveLucideIcon(currentCategory.value?.icon))

  // エディターマップ
  const editorMap: Record<CategoryType, any> = {
    jsonMerge: JsonMergeEditor,
    comments: CommentEventEditor,
    timers: TimerEventEditor,
    services: ServiceEventEditor,
    reactions: ReactionEventEditor,
    box: BoxEditor,
    actions: ActionsEditor,
    placeholders: PlaceholderEditor,
    characters: CharacterEditor,
    ui: UiEditor,
    appInfo: AppInfoEditor,
  } as const
  const currentEditor = computed(() => editorMap[selectedCategory.value])
</script>
