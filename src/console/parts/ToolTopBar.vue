<!-- src/console/parts/ToolTopBar.vue -->
<!-- console の各ツール共通の上部バー。枠 (高さ・背景・余白) とタイトルだけを持つ。中身は slot で渡し、class や @click は root の header にそのまま渡る -->
<template>
  <header class="flex h-10 shrink-0 items-center gap-3 bg-base-300 px-3 text-sm text-base-content select-none">
    <span v-if="title" class="flex items-center gap-2 font-bold">
      <span class="size-2.5 rounded-full bg-primary" />
      {{ title }}
    </span>
    <!-- 左: タイトルの隣に並べる状態表示など -->
    <slot />
    <span class="grow" />
    <!-- 右: 状態表示 → 補助操作 → 中断系 (最右) の順に並べる -->
    <slot name="actions" />
  </header>
</template>

<script setup lang="ts">
  defineProps<{
    /** ツールの名前 (省略するとタイトルは出さない) */
    title?: string
  }>()
</script>
