<!-- src/editor/sidebar/categories/DataCategories.vue -->
<!-- DataCategoryType（Events + Assets）を扱う。新規作成・プリセット・ドラッグ並び替えを持つ -->
<template>
  <div class="flex flex-col gap-0.5 px-2 pt-2">
    <template v-for="(group, groupIndex) in dataCategoryGroups" :key="group.id">
      <!-- グループのサブラベル -->
      <div
        class="px-3 pb-0.5 text-[10px] font-semibold tracking-wider opacity-50 select-none"
        :class="groupIndex > 0 ? 'pt-3' : 'pt-1'"
      >
        {{ t(`navigation.groups.${group.id}`) }}
      </div>

      <template v-for="key in group.keys" :key="key">
        <CategoryButton
          :category="key"
          :icon="visibleCategories[key].icon"
          :count="getCategoryItemCount(key)"
          :isSelected="selectedCategory === key"
          @click="navigateCategory(key)"
        />

        <!-- レコード一覧（カテゴリ選択中 & 開いているときのみ） -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-screen"
          leave-from-class="opacity-100 max-h-screen"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="selectedCategory === key && isOpenCategory[key]">
            <!-- 新規作成ボタン + ドラッグ可能なレコードリスト（データが0件でも表示する） -->
            <RecordList
              :category="key"
              :modelValue="draggableItems[key] ?? noItems"
              @update:modelValue="setItems(key, $event)"
              @dragEnd="onDragEnd"
            />
          </div>
        </transition>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { DataCategoryType } from '@/types/OmikujiData/'
  import { DraggableSubItem } from '@/editor/types/apps'
  import { useCategoryUtils } from '../composables/useCategoryUtils'
  import { useCategoryOpen } from '../composables/useCategoryOpen'
  import { useSidebarDrag } from '../composables/useSidebarDrag'
  import CategoryButton from './CategoryButton.vue'
  import RecordList from '../records/RecordList.vue'

  const { t } = useI18n()

  const { getCategoryItemCount, visibleCategories, dataCategoryGroups } = useCategoryUtils()
  const { selectedCategory, isOpenCategory, navigateCategory } = useCategoryOpen()

  // ドラッグ(常時有効)
  const { draggableItems, onDragEnd } = useSidebarDrag()

  // 一覧の v-model。テンプレート内で computed を毎回作らないよう、props と emit で受け渡す
  const noItems: DraggableSubItem[] = []
  const setItems = (key: DataCategoryType, items: DraggableSubItem[]) => {
    draggableItems.value[key] = items
  }
</script>
