<!-- src/editor/assets/mikuji/weight/WeightItem.vue -->
<!-- おみくじ 1 行分(抽選設定 → 実行内容 → クールダウン)。各部分とダイアログは子コンポーネントに分けてある -->
<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- おみくじ本体(クリックで選択) -->
    <WeightItemSummary
      :item="item"
      :percentage="percentage"
      :isSelected="isSelected"
      @select="emit('select')"
      @open="openDialog"
      @update:weight="emit('update:weight', $event)"
      @duplicate="emit('duplicate')"
      @delete="emit('delete')"
    />

    <span class="shrink-0">→</span>

    <!-- 実行内容(シナリオ / 制御) -->
    <WeightItemRun :item="item" @open="openDialog('run')" />

    <!-- クールダウン(steps のみ) -->
    <WeightItemCooldown :item="item" @update:item="emit('update:item', $event)" />

    <!-- ダイアログ(開いたときだけ作る) -->
    <WeightItemDialogs
      :item="item"
      :opened="openedDialog"
      @close="closeDialog"
      @update:item="emit('update:item', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { useWeightItemDialog } from '../composables/useWeightItemDialog'
  import WeightItemSummary from './WeightItemSummary.vue'
  import WeightItemRun from './WeightItemRun.vue'
  import WeightItemCooldown from './WeightItemCooldown.vue'
  import WeightItemDialogs from './WeightItemDialogs.vue'

  defineProps<{
    item: OmikujiItemType
    color: string
    percentage: string
    isSelected: boolean
  }>()

  const emit = defineEmits<{
    'update:weight': [weight: number]
    'update:item': [item: OmikujiItemType]
    select: []
    duplicate: []
    delete: []
  }>()

  // ダイアログを開くときは、編集中の行を選択状態にする
  const { opened: openedDialog, open: openDialog, close: closeDialog } = useWeightItemDialog(() => emit('select'))
</script>
