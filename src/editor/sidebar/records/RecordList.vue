<!-- src/editor/apps/navigation/SidebarRecordItems.vue -->
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

      <!-- プリセットを新規作成（プリセットがあるカテゴリのみ） -->
      <div v-if="presets.length" class="dropdown dropdown-end">
        <button
          tabindex="0"
          class="btn btn-ghost btn-xs px-1 opacity-70 hover:opacity-100"
          :title="t('navigation.preset.buttonTip', { category: categoryLabel(category) })"
        >
          <Menu class="w-3 h-3" />
        </button>
        <ul
          tabindex="0"
          class="dropdown-content menu z-50 w-64 rounded-md border border-base-300 bg-base-200 text-base-content shadow-lg p-1"
        >
          <li class="menu-title text-xs">{{ t('navigation.preset.title') }}</li>
          <li v-for="preset in presets" :key="preset.id">
            <button class="flex flex-col items-start gap-0 text-xs" @click="handleAddPreset(preset)">
              <span class="font-medium">{{ presetLabel(preset) }}</span>
              <span class="opacity-60 whitespace-normal text-left">{{ presetDescription(preset) }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- ドラッグは常時有効(ハンドルは項目のホバーで表示) -->
    <VueDraggable v-model="localItems" :animation="150" handle=".drag-handle" @end="emit('dragEnd', category)">
      <RecordItem
        v-for="item in localItems.filter((i) => i?.key)"
        :key="item.key"
        :label="item.label ?? ''"
        :isEnabled="item.isEnabled"
        :isSelected="selectedItemKey === item.key"
        draggable
        @select="navigationStore.selectItem(item.key)"
      >
        <template v-if="item.rawItem" #menu>
          <RecordMenu :item="item.rawItem" :category="category" />
        </template>
      </RecordItem>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { VueDraggable } from 'vue-draggable-plus'
  import { DataCategoryType } from '@/types/OmikujiData/'
  import { DraggableSubItem } from '@/editor/types/apps'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import RecordItem from './RecordItem.vue'
  import RecordMenu from './RecordMenu.vue'
  import { useSidebarCreate } from '../composables/useSidebarCreate'
  import { useSidebarPreset } from '../composables/useSidebarPreset'
  import type { PresetDefinition } from '@/editor/presets'
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

  const { presetsOf, presetLabel, presetDescription, addPreset } = useSidebarPreset()
  const presets = computed(() => presetsOf(props.category))

  // 追加後にフォーカスを外して dropdown を閉じる
  const handleAddPreset = (preset: PresetDefinition) => {
    addPreset(preset)
    ;(document.activeElement as HTMLElement)?.blur()
  }

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  const localItems = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })
</script>
