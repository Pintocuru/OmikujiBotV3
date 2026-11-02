<!-- src/editor/content/top/TopEventSection.vue -->
<!-- TOPページ: events の1カテゴリ分。番号=判定の順番。ドラッグハンドルで並び替え可能 -->
<template>
  <section class="space-y-1.5">
    <TopCategoryHeader
      :icon="categoryMap[category].icon"
      :title="t(`categories.${category}.label`)"
      :description="t(`categories.${category}.description`)"
      :count="items.length"
    >
      <template #help>
        <TopEventOrderHelp :category="category" />
      </template>
    </TopCategoryHeader>

    <!-- ドロップ後、並び順を reorderEvents で配列に反映(サイドバーのドラッグと同じ) -->
    <VueDraggable
      :model-value="items"
      tag="div"
      class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5"
      :animation="150"
      handle=".top-drag-handle"
      @update:model-value="onDrag"
    >
      <div
        v-for="(event, index) in items"
        :key="event.id"
        class="group flex items-center gap-1 rounded-lg bg-base-200 p-2 text-left hover:bg-primary hover:text-primary-content transition-colors min-w-0 cursor-pointer"
        :class="{ 'opacity-50': event.isEnabled === false }"
        @click="goToItem(category, event.id)"
      >
        <!-- ドラッグハンドル -->
        <div class="top-drag-handle cursor-move shrink-0" @click.stop>
          <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
        </div>
        <!-- 判定の順番(配列の先頭から順に判定する) -->
        <span class="badge badge-xs badge-neutral">{{ index + 1 }}</span>

        <!-- イベント名と説明 -->
        <div class="min-w-0 flex-1">
          <div class="text-lg font-bold truncate">{{ event.name || event.id }}</div>
          <div class="text-xs text-base-content/60 truncate">{{ event.description }}</div>
        </div>
        <ItemMenu
          @edit="emit('edit', category, event.id)"
          @duplicate="duplicateEventItem(category, event.id)"
          @remove="removeEventItem(category, event.id, event.name)"
        />
      </div>
    </VueDraggable>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VueDraggable } from 'vue-draggable-plus'
  import { GripVertical } from 'lucide-vue-next'
  import type { CategoryType, EventCategoryType } from '@/types/OmikujiData'
  import type { BaseRecordType } from '@/types/core'
  import { categoryMap } from '@/maps/OmikujiData'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useTopItemActions } from '../composables/useTopItemActions'
  import ItemMenu from '../ItemMenu.vue'
  import TopCategoryHeader from './TopCategoryHeader.vue'
  import TopEventOrderHelp from './TopEventOrderHelp.vue'

  const props = defineProps<{
    category: EventCategoryType
  }>()

  const emit = defineEmits<{
    edit: [category: CategoryType, key: string]
  }>()

  const { t } = useI18n()
  const omikujiStore = useOmikujiStore()
  const { getEvents } = useGetEventData()
  const { goToItem, duplicateEventItem, removeEventItem } = useTopItemActions()

  // events は「配列の並び」が正(サイドバーと同じ)。order プロパティでは並べ替えない
  // (order で並べ直すと、reorderEvents の結果が打ち消されてドラッグが元に戻る)
  const items = computed<BaseRecordType[]>(() => [...getEvents(props.category)])

  // ドラッグ後の並び順を配列に反映
  const onDrag = (ordered: BaseRecordType[]) => {
    omikujiStore.reorderEvents(
      props.category,
      ordered.map((event) => event.id)
    )
  }
</script>
