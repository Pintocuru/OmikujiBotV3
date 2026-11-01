<!-- src/editor/content/header/LaneLayout.vue -->
<!-- 参照元(upstream) → 現在のアイテム → 参照先(downstream)。片側が空でも現在のアイテムは中央に固定される -->
<template>
  <div class="grid items-end gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
    <div class="flex min-w-0 flex-wrap items-end justify-end gap-x-2 gap-y-3">
      <slot name="upstream" />
    </div>

    <div class="flex items-center gap-2 text-xl">
      <span v-if="hasUpstream">→</span>
      <ItemSwitcher />
      <span v-if="hasDownstream">→</span>
    </div>

    <div class="flex min-w-0 flex-wrap items-end gap-x-2 gap-y-3">
      <slot name="downstream" />
    </div>

    <!-- ダイアログなど、レイアウトに載らないもの -->
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed, useSlots } from 'vue'
  import ItemSwitcher from './ItemSwitcher.vue'

  const slots = useSlots()
  const hasUpstream = computed(() => !!slots.upstream?.()?.length)
  const hasDownstream = computed(() => !!slots.downstream?.()?.length)
</script>
