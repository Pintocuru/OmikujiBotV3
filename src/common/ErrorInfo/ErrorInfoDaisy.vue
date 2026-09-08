<!-- src/common/ErrorInfo/ErrorInfoDaisy.vue -->
<template>
  <div ref="rootEl" class="w-full h-full">
    <div
      class="flex flex-col items-center w-full h-full px-2 text-center"
      :class="isXs ? 'justify-start pt-2' : 'justify-center gap-1'"
    >
      <!-- ── XS: 極小（〜199px幅 または 〜99px高さ） ── -->
      <!-- アイコン1つだけ -->
      <WifiOff class="w-6 h-6 text-error shrink-0" />

      <!-- ── SM以上: 共通レイアウト ── -->
      <template v-if="!isXs">
        <p class="text-error text-xs font-bold leading-tight">未接続</p>
        <p class="text-error/60 text-xs leading-tight">自動復帰を待機中</p>

        <!-- errorDetail があれば表示 -->
        <p v-if="errorDetail" class="text-warning text-xs leading-tight break-all mt-1">
          {{ errorDetail }}
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { WifiOff } from 'lucide-vue-next'

  const props = defineProps<{
    errorDetail?: string
  }>()

  // ── サイズ監視 ──────────────────────────────────────
  const rootEl = ref<HTMLElement | null>(null)
  const containerWidth = ref(window.innerWidth)
  const containerHeight = ref(window.innerHeight)

  const isXs = computed<boolean>(() => {
    if (containerWidth.value < 200 || containerHeight.value < 100) return true
    return false
  })

  let ro: ResizeObserver | null = null

  onMounted(() => {
    if (!rootEl.value) return
    ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
        containerHeight.value = entry.contentRect.height
      }
    })
    ro.observe(rootEl.value)
    const rect = rootEl.value.getBoundingClientRect()
    containerWidth.value = rect.width || window.innerWidth
    containerHeight.value = rect.height || window.innerHeight
  })

  onBeforeUnmount(() => ro?.disconnect())

  // 再読み込み
  const RELOAD_SEC = 15
  let reloadTimer: ReturnType<typeof setTimeout> | null = null

  const handleReload = () => window.location.reload()

  onMounted(() => {
    reloadTimer = setTimeout(handleReload, RELOAD_SEC * 1000)
  })

  onBeforeUnmount(() => {
    if (reloadTimer) clearTimeout(reloadTimer)
  })
</script>
