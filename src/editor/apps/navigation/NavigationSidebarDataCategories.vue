<!-- src/editor/apps/navigation/NavigationSidebarDataCategories.vue -->
<!-- DataCategoryType（Events + Assets）を扱う。新規作成・プリセット・ドラッグ並び替えを持つ -->
<template>
  <div class="flex flex-col gap-0.5 px-2 pt-2">
    <template v-for="(group, groupIndex) in dataCategoryGroups" :key="group.id">
      <!-- グループのサブラベル（折りたたみ中は区切り線のみ） -->
      <div
        v-if="isExpanded"
        class="px-3 pb-0.5 text-[10px] font-semibold tracking-wider opacity-50 select-none"
        :class="groupIndex > 0 ? 'pt-3' : 'pt-1'"
      >
        {{ t(`navigation.groups.${group.id}`) }}
      </div>
      <hr v-else-if="groupIndex > 0" class="border-base-300 my-1 mx-2" />

      <template v-for="key in group.keys" :key="key">
        <SidebarCategoryButton
          :category="key"
          :icon="filteredCategoryLabels[key].icon"
          :count="getCategoryItemCount(key)"
          :isSelected="selectedCategory === key"
          :isExpanded="isExpanded"
          @click="navigateCategory(key)"
        />

        <!-- サブ項目（サイドバー展開中 & カテゴリ選択中 & 開いているときのみ） -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="isExpanded && selectedCategory === key && isOpenCategory[key]">
            <!-- 新規作成ボタン + ドラッグ可能なアイテムリスト（データが0件でも表示する） -->
            <SidebarRecordItems
              :category="key"
              v-model="getDraggableModel(key).value"
              v-model:isDragEnabled="isDragEnabled"
              @dragEnd="onDragEnd"
            />
          </div>
        </transition>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { DataCategoryType } from '@/types/OmikujiData/'
  import { useCategoryUtils } from './composables/useCategoryUtils'
  import { useCategoryOpen } from './composables/useCategoryOpen'
  import { useNavigationSidebarDrag } from './composables/useNavigationSidebarDrag'
  import SidebarCategoryButton from './SidebarCategoryButton.vue'
  import SidebarRecordItems from './SidebarRecordItems.vue'

  const { t } = useI18n()

  const props = defineProps<{
    isExpanded: boolean
  }>()

  const { getCategoryItemCount, filteredCategoryLabels, dataCategoryGroups } = useCategoryUtils()
  const { selectedCategory, isOpenCategory, navigateCategory } = useCategoryOpen()

  // ドラッグ
  const { draggableItems, onDragEnd, isDragDisabled } = useNavigationSidebarDrag(computed(() => props.isExpanded))
  // isDragDisabled（ドラッグ中フラグ）を isDragEnabled として子に渡す
  const isDragEnabled = computed({
    get: () => isDragDisabled.value,
    set: (val) => (isDragDisabled.value = val),
  })

  const getDraggableModel = (key: DataCategoryType) =>
    computed({
      get: () => draggableItems.value[key] ?? [],
      set: (val) => {
        draggableItems.value[key] = val
      },
    })
</script>
