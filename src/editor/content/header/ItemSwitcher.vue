<!-- src/editor/content/header/ItemSwitcher.vue -->
<!-- 現在のアイテム名。プルダウンで同じカテゴリの別アイテムへ移動でき、鉛筆ボタンで基本設定を編集する -->
<template>
  <div class="flex items-center gap-1">
    <div class="dropdown">
      <button tabindex="0" class="btn btn-sm btn-primary gap-1 max-w-64">
        <component :is="resolveLucideIcon(categoryMap[selectedCategory].icon)" class="w-4 h-4 shrink-0" />
        <span class="truncate">{{ currentName }}</span>
        <TriangleAlert v-if="isCyclic(selectedItemKey)" class="w-4 h-4 shrink-0" />
        <span v-if="isDisabled" class="badge badge-sm">{{ t('connections.switcher.disabled') }}</span>
        <ChevronsUpDown class="w-3.5 h-3.5 shrink-0 opacity-70" />
      </button>

      <ul
        tabindex="0"
        class="dropdown-content menu menu-sm bg-base-100 rounded-box z-20 mt-1 w-72 max-h-80 flex-nowrap overflow-y-auto p-2 shadow"
      >
        <li v-for="item in items" :key="item.key">
          <button :class="{ 'menu-active': item.key === selectedItemKey }" @click="select(item.key)">
            <span class="truncate" :class="{ 'opacity-50': item.isEnabled === false }">{{ item.name || item.key }}</span>
            <TriangleAlert
              v-if="isCyclic(item.key)"
              class="w-3.5 h-3.5 shrink-0 text-error"
              :title="t('connections.switcher.cyclic')"
            />
          </button>
        </li>
      </ul>
    </div>

    <div class="tooltip tooltip-bottom" :data-tip="t('connections.switcher.edit')">
      <button class="btn btn-sm btn-ghost btn-square" @click="editOpen = true">
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <ItemEditDialog v-model:open="editOpen" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ChevronsUpDown, Pencil, TriangleAlert } from 'lucide-vue-next'
  import { categoryMap } from '@/maps/OmikujiData'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import ItemEditDialog from './ItemEditDialog.vue'
  import { useReferenceGraph } from '../composables/useReferenceGraph'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey, selectedItem, categoryArray } = storeToRefs(navigationStore)

  const { cyclicScenarioKeys, cyclicPlaceholderKeys } = useReferenceGraph()

  const editOpen = ref(false)

  /** 循環参照に含まれるアイテムか(シナリオ・プレースホルダーのみ) */
  const isCyclic = (key: string | null) => {
    if (!key) return false
    if (selectedCategory.value === 'scenarios') return cyclicScenarioKeys.value.has(key)
    if (selectedCategory.value === 'placeholders') return cyclicPlaceholderKeys.value.has(key)
    return false
  }

  const items = computed(() => categoryArray.value ?? [])
  const currentName = computed(() => selectedItem.value?.name || selectedItemKey.value || '')
  const isDisabled = computed(() => selectedItem.value?.isEnabled === false)

  /** 選択後にメニューを閉じる(daisyUI の dropdown はフォーカスで開閉する) */
  const select = (key: string) => {
    navigationStore.selectItem(key)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }
</script>
