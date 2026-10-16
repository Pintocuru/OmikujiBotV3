<!-- src/editor/apps/appItems/navigation/NavigationSidebarCategories.vue -->
<template>
  <div class="flex flex-col gap-0.5 p-2 flex-1">
    <template v-for="(group, groupIndex) in categoryGroups" :key="group.id">
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
        <!-- カテゴリボタン -->
        <button
          class="btn w-full relative flex items-center gap-2 min-h-0 h-auto py-2"
          :class="[
            selectedCategory === key ? 'bg-primary text-primary-content hover:bg-primary' : 'btn-ghost',
            isExpanded ? 'justify-start px-3' : 'justify-center px-0',
          ]"
          :title="`${t(`categories.${key}.label`)}：${t(`categories.${key}.description`)}`"
          @click="navigateCategory(key)"
        >
          <component :is="resolveLucideIcon(filteredCategoryLabels[key].icon)" class="w-5 h-5 shrink-0" />
          <span v-if="isExpanded" class="text-sm truncate text-left flex-1">{{ t(`categories.${key}.label`) }}</span>
          <span
            v-if="getCategoryItemCount(key) > 0"
            class="badge badge-xs badge-primary shrink-0"
            :class="isExpanded ? '' : 'absolute -top-1 -right-1'"
          >
            {{ getCategoryItemCount(key) }}
          </span>
        </button>

        <!-- サブ項目（サイドバー展開中 & カテゴリ選択中 & 開いているときのみ） -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <template v-if="isExpanded && selectedCategory === key && isOpenCategory[key]">
            <!-- variant で category の型が絞り込まれる -->
            <template v-for="entry in [resolveEntry(key)]" :key="entry.category">
              <!-- Record：新規作成ボタン + ドラッグ可能なアイテムリスト（データが0件でも表示する） -->
              <SidebarRecordItems
                v-if="entry.variant === 'record'"
                :category="entry.category"
                v-model="getDraggableModel(entry.category).value"
                v-model:isDragEnabled="isDragEnabled"
                @dragEnd="onDragEnd"
              />

              <!-- Array：jsonMerge の静的リスト -->
              <SidebarArrayItems
                v-else-if="entry.variant === 'array'"
                :category="entry.category"
                :items="getJsonMergeItems()"
              />

              <!-- Object：appInfo / ui のセクションリスト -->
              <SidebarObjectItems v-else :category="entry.category" />
            </template>
          </template>
        </transition>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { CategoryType, DataCategoryType } from '@/types/OmikujiData/'
  import { useCategoryUtils } from './composables/useCategoryUtils'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useNavigationSidebarDrag } from './composables/useNavigationSidebarDrag'
  import { useSidebarSubItems } from './composables/useSidebarSubItems'
  import { provideSidebarContext } from './composables/useSidebarContext'
  import SidebarRecordItems from './SidebarRecordItems.vue'
  import SidebarArrayItems from './SidebarArrayItems.vue'
  import SidebarObjectItems from './SidebarObjectItems.vue'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const { t } = useI18n()

  const props = defineProps<{
    isExpanded: boolean
  }>()

  // Context（theme / selectedItemKey / activeSection を子孫全体に注入）
  provideSidebarContext()

  // ストア
  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)

  // カテゴリユーティリティ
  const { getCategoryItemCount, filteredCategoryLabels, categoryGroups } = useCategoryUtils()

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

  // サブ項目ロジック
  const { resolveEntry, getJsonMergeItems } = useSidebarSubItems()

  // 開閉状態
  const isOpenCategory = ref<Record<string, boolean>>({})

  const navigateCategory = (key: CategoryType) => {
    isOpenCategory.value = { [key]: !isOpenCategory.value[key] }
    navigationStore.selectCategory(key)
  }
</script>
