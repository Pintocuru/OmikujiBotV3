<!-- src/editor/apps/appItems/ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div id="section-Top" class="flex items-center justify-between px-4 py-3 bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-lg font-bold">
      <component :is="currentIcon" class="w-6 h-6" />
      {{ t(`categories.${selectedCategory}.label`) }}
    </div>

    <div class="text-sm opacity-80">
      {{ t(`categories.${selectedCategory}.description`) }}
    </div>
  </div>

  <!-- データが0件のとき（Events / Assets）：新規作成を促す -->
  <NoParamsCard
    v-if="isEmpty"
    :key="selectedCategory"
    class="mt-4"
    :iconName="currentCategory.icon"
    :message="t('navigation.create.emptyMessage')"
    :sub="t('navigation.create.emptyHint')"
  />

  <component :is="currentEditor" v-else />
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { CategoryType } from '@/types/OmikujiData'
  import { categoryMap } from '@/maps/OmikujiData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import CommentEventEditor from '@/editor/events/comment/CommentEditor.vue'
  import TimerEventEditor from '@/editor/events/timer/TimerEditor.vue'
  import ServiceEventEditor from '@/editor/events/service/ServiceEditor.vue'
  import ReactionEventEditor from '@/editor/events/reaction/ReactionEditor.vue'

  import MikujiEditor from '@/editor/assets/mikuji/MikujiEditor.vue'
  import ActionsEditor from '@/editor/assets/actions/ActionsEditor.vue'
  import PlaceholderEditor from '@/editor/assets/placeholders/PlaceholderEditor.vue'
  import CharacterEditor from '@/editor/assets/characters/CharacterEditor.vue'

  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import UiEditor from '@/editor/ui/UiEditor.vue'
  import AppInfoEditor from '@/editor/apps/appInfo/AppInfoEditor.vue'
  import JsonMergeEditor from '@/editor/apps/JsonMerge/JsonMergeEditor.vue'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedCategory, isCurrentDataCategory, categoryArray } = storeToRefs(navigationStore)

  // Events / Assets のカテゴリでデータが1件もない
  const isEmpty = computed(() => isCurrentDataCategory.value && (categoryArray.value?.length ?? 0) === 0)

  const currentCategory = computed(() => categoryMap[selectedCategory.value])
  const currentIcon = computed(() => resolveLucideIcon(currentCategory.value?.icon))

  // エディターマップ
  const editorMap: Record<CategoryType, Component> = {
    jsonMerge: JsonMergeEditor,

    // events
    comments: CommentEventEditor,
    timers: TimerEventEditor,
    services: ServiceEventEditor,
    reactions: ReactionEventEditor,

    // assets
    mikuji: MikujiEditor,
    actions: ActionsEditor,
    placeholders: PlaceholderEditor,
    characters: CharacterEditor,

    //
    ui: UiEditor,
    appInfo: AppInfoEditor,
  } as const
  const currentEditor = computed(() => editorMap[selectedCategory.value])
</script>
