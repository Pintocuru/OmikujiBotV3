<!-- src/generator/components/NoticeWidget.vue -->
<!-- クールダウンのブロックやエラーを、画面の右下に小さく知らせる。ToastWidgets とは独立して常に表示できる -->
<template>
  <TransitionGroup
    name="notice"
    tag="div"
    class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1 pointer-events-none select-none"
  >
    <div
      v-for="notice in stageNotices"
      :key="notice.id"
      class="max-w-sm wrap-break-word px-2 py-1 rounded-2xl shadow-md text-[10px] font-medium bg-base-200/90 text-base-content border"
      :class="kindClass[notice.kind]"
    >
      {{ noticeText(notice) }}
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted } from 'vue'
  import { notices, registerNoticeHost, type Notice, type NoticeKind } from '@/common/Notice/noticeState'

  // 配信画面向けの通知(scope: 'stage')だけを出す
  const stageNotices = computed(() => notices.value.filter((notice) => notice.scope === 'stage'))

  let unregister: (() => void) | undefined
  onMounted(() => {
    unregister = registerNoticeHost('stage')
  })
  onBeforeUnmount(() => unregister?.())

  // タイトルと補足は 1 行にまとめる(小さく出すため)
  const noticeText = (notice: Notice) => (notice.text ? `${notice.title}: ${notice.text}` : notice.title)

  const kindClass: Record<NoticeKind, string> = {
    cooldown: 'border-warning/40',
    warning: 'border-warning/40',
    info: 'border-info/40',
    success: 'border-success/40',
    error: 'border-error/60 text-error',
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
