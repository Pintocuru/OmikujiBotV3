<!-- src/generator/CooldownNoticeWidget.vue -->
<!-- クールダウンでおみくじがブロックされたことを、画面の右下に小さく知らせる。ToastWidgets とは独立して常に表示できる -->
<template>
  <TransitionGroup
    name="notice"
    tag="div"
    class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1 pointer-events-none select-none"
  >
    <div
      v-for="notice in notices"
      :key="notice.id"
      class="px-3 py-1.5 rounded-full shadow-md text-sm font-medium bg-base-200/90 text-base-content border border-warning/40"
    >
      {{ notice.text }}
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useCooldownNoticeStore } from '@/generator/stores/useCooldownNoticeStore'

  const { notices } = storeToRefs(useCooldownNoticeStore())
</script>

<style scoped>
  .notice-enter-active,
  .notice-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
  .notice-enter-from,
  .notice-leave-to {
    opacity: 0;
    transform: translateX(1rem);
  }
</style>
