<!-- src/common/Notice/ToastHost.vue -->
<!-- notify.* の表示先(エディター・マネージャー・コンソール用) -->
<template>
  <div
    ref="hostRef"
    popover="manual"
    class="toast toast-end toast-bottom pointer-events-none m-0 overflow-visible border-0 bg-transparent p-4 text-base-content"
  >
    <TransitionGroup name="toast-item">
      <div
        v-for="notice in appNotices"
        :key="notice.id"
        class="alert pointer-events-auto relative max-w-sm cursor-pointer items-start overflow-hidden text-sm shadow-lg"
        :class="kindClass[notice.kind]"
        role="status"
        @mouseenter="pauseNotice(notice.id)"
        @mouseleave="resumeNotice(notice.id)"
        @click="removeNotice(notice.id)"
      >
        <component :is="kindIcon[notice.kind]" class="mt-0.5 h-5 w-5 shrink-0" />
        <div class="min-w-0 flex-1">
          <p class="font-bold wrap-break-word">{{ notice.title }}</p>
          <p v-if="notice.text" class="whitespace-pre-line text-xs wrap-break-word opacity-90">{{ notice.text }}</p>
        </div>
        <button v-if="notice.action" class="btn btn-xs" @click.stop="runAction(notice)">
          {{ notice.action.label }}
        </button>

        <!-- 残り時間(ホバー中は止まる) -->
        <span
          class="toast-progress absolute inset-x-0 bottom-0 h-1 origin-left bg-current opacity-40"
          :style="{ animationDuration: `${notice.durationMs}ms` }"
        ></span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import type { Component } from 'vue'
  import { CircleCheck, CircleX, Info, TriangleAlert } from '@lucide/vue'
  import {
    notices,
    pauseNotice,
    registerNoticeHost,
    removeNotice,
    resumeNotice,
    type Notice,
    type NoticeKind,
  } from './noticeState'

  // Tailwind が拾えるよう、クラス名は完全な文字列で書く
  const kindClass: Record<NoticeKind, string> = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info',
    cooldown: 'alert-warning',
  }
  const kindIcon: Record<NoticeKind, Component> = {
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleX,
    info: Info,
    cooldown: TriangleAlert,
  }

  const appNotices = computed(() => notices.value.filter((notice) => notice.scope === 'app'))

  const runAction = (notice: Notice) => {
    notice.action?.run()
    removeNotice(notice.id)
  }

  // ---- 最前面に出す(Popover API が使える環境のみ。使えなければ通常の固定表示) ----
  const hostRef = ref<HTMLElement | null>(null)

  const bringToFront = () => {
    const el = hostRef.value
    if (!el || typeof el.showPopover !== 'function') return
    // 開き直すと、トップレイヤーの一番上に来る
    if (el.matches(':popover-open')) el.hidePopover()
    el.showPopover()
  }

  let unregister: (() => void) | undefined
  onMounted(() => {
    unregister = registerNoticeHost('app')
    bringToFront()
  })
  onBeforeUnmount(() => unregister?.())

  // 通知が増えたとき、あとから開いたダイアログの裏に隠れないよう前面に出し直す
  watch(
    () => appNotices.value.length,
    async (length, previous) => {
      if (length > previous) {
        await nextTick()
        bringToFront()
      }
    }
  )
</script>

<style scoped>
  .toast-progress {
    animation-name: toast-progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  /* ホバー中(タイマー停止中)は、バーも止める */
  .alert:hover .toast-progress {
    animation-play-state: paused;
  }
  @keyframes toast-progress {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }

  .toast-item-enter-active,
  .toast-item-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }
  .toast-item-enter-from,
  .toast-item-leave-to {
    opacity: 0;
    transform: translateX(1rem);
  }
</style>
