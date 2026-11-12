<!-- src/generator/NoticeWidget.vue -->
<!-- クールダウンのブロックやエラーを、画面の右下に小さく知らせる。ToastWidgets とは独立して常に表示できる -->
<template>
  <TransitionGroup
    name="notice"
    tag="div"
    class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1 pointer-events-none select-none"
  >
    <div
      v-for="notice in notices"
      :key="notice.id"
      class="max-w-sm wrap-break-word px-2 py-1 rounded-2xl shadow-md text-[10px] font-medium bg-base-200/90 text-base-content border"
      :class="[
        kindClass[notice.kind],
        notice.kind === 'error' && 'pointer-events-auto cursor-copy',
      ]"
      :title="notice.kind === 'error' ? 'ダブルクリックでコピー' : undefined"
      @dblclick="notice.kind === 'error' && copyNotice(notice.text)"
    >
      {{ notice.text }}
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useNoticeStore, type NoticeKind } from '@/generator/stores/useNoticeStore'

  const { notices } = storeToRefs(useNoticeStore())

  const kindClass: Record<NoticeKind, string> = {
    cooldown: 'border-warning/40',
    error: 'border-error/60 text-error',
  }

  const copyNotice = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.warn('通知のコピーに失敗しました', error)
    }
  }
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
