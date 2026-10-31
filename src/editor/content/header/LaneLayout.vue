<!-- src/editor/content/header/LaneLayout.vue -->
<!-- 接続表示の3分割レイアウト: 参照元(upstream) → 現在のアイテム → 参照先(downstream)。片側が空でも現在のアイテムは中央に固定される -->
<template>
  <div class="grid grid-cols-1 items-end gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
    <div class="flex min-w-0 flex-wrap items-end gap-x-2 gap-y-3 md:justify-end">
      <slot name="upstream" />
      <ArrowRight v-if="$slots.upstream" class="w-4 h-4 mb-2 opacity-60 shrink-0 max-md:rotate-90" />
    </div>

    <ItemSwitcher />

    <div class="flex min-w-0 flex-wrap items-end gap-x-2 gap-y-3">
      <ArrowRight v-if="$slots.downstream" class="w-4 h-4 mb-2 opacity-60 shrink-0 max-md:rotate-90" />
      <slot name="downstream" />
    </div>

    <!-- ダイアログなど、レイアウトに載らないもの -->
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { ArrowRight } from 'lucide-vue-next'
  import ItemSwitcher from './ItemSwitcher.vue'
</script>
