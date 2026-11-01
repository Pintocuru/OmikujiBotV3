<!-- src/editor/content/connections/LaneLayout.vue -->
<!-- 親(参照元) → 自分(現在のアイテム) → 子(参照先)。片側が空でも現在のアイテムは中央に固定される。
     親・子のラベルは各 Lane から受け取り、自分のラベルは現在のカテゴリ名を出す。狭い幅では縦に並び、矢印は ↓ になる -->
<template>
  <div class="grid items-end gap-x-3 gap-y-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
    <!-- 親 -->
    <div class="flex min-w-0 flex-col gap-1 md:items-end">
      <template v-if="$slots.upstream">
        <span class="text-xs font-bold opacity-70 md:text-right">{{ upstreamLabel }}</span>
        <div class="flex flex-wrap items-end gap-x-2 gap-y-3 md:justify-end">
          <slot name="upstream" />
        </div>
      </template>
    </div>
    <span v-if="$slots.upstream" class="text-center text-xl md:hidden">↓</span>

    <!-- 自分 -->
    <div class="flex flex-col items-start gap-1 md:items-center">
      <span class="text-xs font-bold opacity-70">{{ selfLabel }}</span>
      <div class="flex items-center gap-2 text-xl">
        <span v-if="$slots.upstream" class="hidden md:inline">→</span>
        <ItemSwitcher />
        <span v-if="$slots.downstream" class="hidden md:inline">→</span>
      </div>
    </div>
    <span v-if="$slots.downstream" class="text-center text-xl md:hidden">↓</span>

    <!-- 子 -->
    <div class="flex min-w-0 flex-col gap-1">
      <template v-if="$slots.downstream">
        <span class="text-xs font-bold opacity-70">{{ downstreamLabel }}</span>
        <div class="flex flex-wrap items-end gap-x-2 gap-y-3">
          <slot name="downstream" />
        </div>
      </template>
    </div>

    <!-- ダイアログなど、レイアウトに載らないもの -->
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import ItemSwitcher from './ItemSwitcher.vue'

  defineProps<{
    /** 親(参照元)の列のラベル。upstream スロットがあるとき出す */
    upstreamLabel?: string
    /** 子(参照先)の列のラベル。downstream スロットがあるとき出す */
    downstreamLabel?: string
  }>()

  const { t } = useI18n()
  const { selectedCategory } = storeToRefs(useNavigationStore())

  // 自分の列のラベルは、現在のカテゴリ名(イベント / みくじ箱 / シナリオ ...)
  const selfLabel = computed(() => t(`categories.${selectedCategory.value}.label`))
</script>
