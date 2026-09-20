<!-- src/common/ErrorInfo/ConnectionStatusIndicator.vue -->
<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full shadow-md text-sm font-medium bg-base-200/80 backdrop-blur-sm select-none"
      :class="statusConfig.badgeClass"
    >
      <component :is="statusConfig.icon" class="w-4 h-4" :class="{ 'animate-spin': props.status === 'initializing' }" />
      <span>{{ statusConfig.label }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { AppStatus } from '@/types/core'
  import { statusConfigMap } from '@/maps/common/StatusConfigMap'

  const props = defineProps<{
    status: AppStatus
  }>()

  // ready 時の自動非表示タイマー
  const readyVisible = ref(true)
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  watch(
    () => props.status,
    (val) => {
      if (val === 'ready') {
        readyVisible.value = true
        hideTimer = setTimeout(() => {
          readyVisible.value = false
        }, 3000)
      } else {
        if (hideTimer) clearTimeout(hideTimer)
        readyVisible.value = true
      }
    }
  )

  // 1つのcomputedで設定を取得
  const statusConfig = computed(() => statusConfigMap[props.status])

  // 表示状態の判定（特別な処理はここに残す）
  const isVisible = computed(() => {
    if (props.status === 'ready') return readyVisible.value
    return statusConfig.value.isAlwaysVisible ?? true
  })
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
