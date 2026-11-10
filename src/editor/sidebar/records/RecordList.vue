<!-- src/editor/sidebar/records/RecordList.vue -->
<template>
  <div>
    <!-- 新規作成 + プリセット追加（データが0件でもここから作成できる） -->
    <div class="flex items-center pr-1">
      <button
        class="btn btn-ghost btn-xs flex-1 min-w-0 justify-start gap-1 pl-4 pr-1 text-xs font-normal opacity-70 hover:opacity-100"
        :title="t('navigation.create.buttonTip', { category: categoryLabel(category) })"
        @click="createItem(category)"
      >
        <Plus class="w-3 h-3 shrink-0" />
        <span class="truncate">{{ t('navigation.create.button') }}</span>
      </button>

      <!-- プリセットを新規作成（プリセットがあるカテゴリのみ）: ダイアログで選ぶ -->
      <div v-if="presets.length" :title="t('navigation.preset.buttonTip', { category: categoryLabel(category) })">
        <button
          class="btn btn-ghost btn-xs btn-square opacity-70 hover:opacity-100"
          :aria-label="t('navigation.preset.buttonTip', { category: categoryLabel(category) })"
          @click="isPresetDialogOpen = true"
        >
          <Menu class="w-3 h-3" />
        </button>
      </div>
      <PresetDialog v-if="presets.length" v-model:open="isPresetDialogOpen" :category="category" />
    </div>

    <!-- ドラッグは常時有効(ハンドルは項目のホバーで表示) -->
    <VueDraggable v-model="localItems" :animation="150" handle=".drag-handle" @end="emit('dragEnd', category)">
      <RecordItem
        v-for="item in localItems.filter((i) => i?.key)"
        :key="item.key"
        :label="item.label ?? ''"
        :isEnabled="item.isEnabled"
        :isSelected="selectedCategory === category && selectedItemKey === item.key"
        draggable
        @select="selectRecord(item.key)"
      >
        <template v-if="item.rawItem" #menu>
          <RecordMenu :item="item.rawItem" :category="category" />
        </template>
      </RecordItem>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { VueDraggable } from 'vue-draggable-plus'
  import { DataCategoryType } from '@/types/OmikujiData/'
  import { DraggableSubItem } from '@/editor/types/apps'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import RecordItem from './RecordItem.vue'
  import RecordMenu from './RecordMenu.vue'
  import PresetDialog from './PresetDialog.vue'
  import { useSidebarCreate } from '../composables/useSidebarCreate'
  import { useSidebarPreset } from '../composables/useSidebarPreset'
  import { Menu, Plus } from 'lucide-vue-next'

  const props = defineProps<{
    category: DataCategoryType
    modelValue: DraggableSubItem[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [items: DraggableSubItem[]]
    dragEnd: [category: DataCategoryType]
  }>()

  const { t } = useI18n()
  const { categoryLabel, createItem } = useSidebarCreate()

  const { presetsOf } = useSidebarPreset()
  const presets = computed(() => presetsOf(props.category))

  const isPresetDialogOpen = ref(false)

  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)

  // レコードを選んだときだけ ContentArea のカテゴリ・レコードを切り替える
  const selectRecord = (key: string) => {
    navigationStore.selectCategory(props.category)
    navigationStore.selectItem(key)
  }

  const localItems = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })
</script>
