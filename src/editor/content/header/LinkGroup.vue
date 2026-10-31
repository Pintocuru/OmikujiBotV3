<!-- src/editor/content/header/LinkGroup.vue -->
<!-- 接続先のチップ一覧(ラベル付き)。クリックでそのアイテムへ移動する -->
<template>
  <div v-if="items.length > 0 || emptyText" class="min-w-0">
    <div class="text-xs font-bold opacity-70 mb-1">{{ label }}</div>

    <div v-if="items.length === 0" class="rounded-lg bg-neutral text-neutral-content px-2 py-1 text-sm">
      {{ emptyText }}
    </div>
    <div v-else class="flex flex-wrap items-center gap-1">
      <button
        v-for="item in visibleItems"
        :key="item.category + item.key"
        class="btn btn-xs btn-outline gap-1"
        :title="t(`categories.${item.category}.label`)"
        @click="goTo(item)"
      >
        <component :is="resolveLucideIcon(categoryMap[item.category].icon)" class="w-3.5 h-3.5 shrink-0" />
        <span class="max-w-48 truncate">{{ item.name }}</span>
      </button>

      <!-- 多いときは残りをパネルにまとめる -->
      <div v-if="hiddenItems.length > 0" class="dropdown">
        <button tabindex="0" class="btn btn-xs btn-ghost">+{{ hiddenItems.length }}</button>
        <ul
          tabindex="0"
          class="dropdown-content menu menu-sm bg-base-100 rounded-box z-20 mt-1 w-64 max-h-72 flex-nowrap overflow-y-auto p-2 shadow"
        >
          <li v-for="item in hiddenItems" :key="item.category + item.key">
            <button @click="goTo(item)">
              <component :is="resolveLucideIcon(categoryMap[item.category].icon)" class="w-4 h-4 shrink-0" />
              <span class="truncate">{{ item.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { categoryMap } from '@/maps/OmikujiData'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import type { LinkItem } from './types'

  const props = withDefaults(
    defineProps<{
      label: string
      items: LinkItem[]
      /** 0件のとき暗い背景で出す文言。省略すると 0件のときグループごと隠す */
      emptyText?: string
      /** チップで並べる最大数。超えた分は「+n」のパネルに入る */
      limit?: number
    }>(),
    { emptyText: undefined, limit: 5 }
  )

  const visibleItems = computed(() => props.items.slice(0, props.limit))
  const hiddenItems = computed(() => props.items.slice(props.limit))

  const { t } = useI18n()
  const navigationStore = useNavigationStore()

  const goTo = (item: LinkItem) => {
    navigationStore.selectCategory(item.category)
    navigationStore.selectItem(item.key)
    // パネルのチップから選んだとき、開いたままにならないようフォーカスを外す
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }
</script>
