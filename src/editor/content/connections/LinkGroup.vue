<!-- src/editor/content/connections/LinkGroup.vue -->
<!-- 接続先のチップ一覧。クリックでそのアイテムへ移動する(親・子のラベルは LaneLayout が出す) -->
<template>
  <div v-if="items.length > 0 || emptyText || isLoading" class="min-w-0">
    <!-- 検索中で、まだ出せるものがないとき(「なし」とは言わない) -->
    <div
      v-if="items.length === 0 && isLoading"
      class="flex items-center gap-2 rounded-lg bg-neutral text-neutral-content px-2 py-1 text-xs"
    >
      <span class="loading loading-spinner loading-xs" />
      {{ t('connections.searching') }}
    </div>
    <div v-else-if="items.length === 0" class="rounded-lg bg-neutral text-neutral-content px-2 py-1 text-xs">
      {{ emptyText }}
    </div>
    <div v-else class="flex flex-wrap items-center gap-1">
      <template v-for="item in visibleItems" :key="item.category + item.key">
        <!-- 存在しない(削除済み)参照は、移動できるように見せない -->
        <span v-if="item.missing" class="badge badge-warning h-6 max-w-64 gap-1" :title="missingText(item)">
          <TriangleAlert class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate">{{ missingText(item) }}</span>
        </span>
        <button
          v-else
          class="btn btn-xs btn-outline gap-1"
          :title="t(`categories.${item.category}.label`)"
          @click="goTo(item)"
        >
          <component :is="resolveLucideIcon(categoryMap[item.category].icon)" class="w-3.5 h-3.5 shrink-0" />
          <span class="max-w-48 truncate">{{ item.name }}</span>
        </button>
      </template>

      <!-- 多いときは残りをパネルにまとめる -->
      <div v-if="hiddenItems.length > 0" class="dropdown">
        <button tabindex="0" class="btn btn-xs btn-ghost">+{{ hiddenItems.length }}</button>
        <ul
          tabindex="0"
          class="dropdown-content menu menu-sm bg-base-100 rounded-box z-20 mt-1 w-64 max-h-72 flex-nowrap overflow-y-auto p-2 shadow"
        >
          <li v-for="item in hiddenItems" :key="item.category + item.key">
            <span v-if="item.missing" class="pointer-events-none text-warning">
              <TriangleAlert class="w-4 h-4 shrink-0" />
              <span class="truncate">{{ missingText(item) }}</span>
            </span>
            <button v-else @click="goTo(item)">
              <component :is="resolveLucideIcon(categoryMap[item.category].icon)" class="w-4 h-4 shrink-0" />
              <span class="truncate">{{ item.name }}</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- 更新中は前の結果を出したまま、小さく表示する -->
      <span v-if="isLoading" class="loading loading-spinner loading-xs opacity-60" :title="t('connections.searching')" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TriangleAlert } from 'lucide-vue-next'
  import { categoryMap } from '@/maps/OmikujiData'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useCategoryOpen } from '@/editor/sidebar/composables/useCategoryOpen'
  import { useReferenceGraph } from '../composables/useReferenceGraph'
  import type { LinkItem } from './types'

  const props = withDefaults(
    defineProps<{
      items: LinkItem[]
      /** 0件のとき暗い背景で出す文言。省略すると 0件のときグループごと隠す */
      emptyText?: string
      /** チップで並べる最大数。超えた分は「+n」のパネルに入る */
      limit?: number
      /** 検索中の表示を強制する(true/false)。省略すると参照グラフの構築状況に従う */
      loading?: boolean
    }>(),
    { emptyText: undefined, limit: 5, loading: undefined }
  )

  const { isSearching } = useReferenceGraph()
  const isLoading = computed(() => props.loading ?? isSearching.value)

  const visibleItems = computed(() => props.items.slice(0, props.limit))
  const hiddenItems = computed(() => props.items.slice(props.limit))

  const { t } = useI18n()
  const navigationStore = useNavigationStore()

  const { revealCategory } = useCategoryOpen()

  const missingText = (item: LinkItem) => t('connections.scenarioMissing', { key: item.key })

  const goTo = (item: LinkItem) => {
    if (item.missing) return
    navigationStore.selectCategory(item.category)
    navigationStore.selectItem(item.key)
    // 移動先のページでは複製・削除ができない(サイドバーから行う)ので、サイドバーを開いたときに該当アイテムが見えるよう、親カテゴリの一覧を開いておく
    // (サイドバー自体の開閉はユーザー操作に任せる)
    revealCategory(item.category)
    // パネルのチップから選んだとき、開いたままにならないようフォーカスを外す
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }
</script>
