<!-- src/common/ErrorInfo/ErrorInfo.vue -->
<template>
  <div ref="rootEl" class="w-full h-full flex flex-col items-center justify-center p-2">
    <!-- 極小画面 -->
    <template v-if="isXs">
      <AlertTriangle class="w-6 h-6 text-error shrink-0" />
    </template>

    <!-- 通常画面 -->
    <div v-else class="card bg-base-100 border border-error w-full max-w-2xl shadow-lg">
      <div class="card-body gap-4 p-4 sm:p-6">
        <!-- ヘッダー -->
        <h2 class="flex items-center justify-center gap-2 text-error text-lg sm:text-xl font-bold">
          <AlertTriangle class="w-6 h-6 shrink-0" />
          読み込みエラー
          <span class="text-sm font-normal">/ Load Error</span>
        </h2>

        <!-- エラー説明 -->
        <div role="alert" class="alert alert-error">
          <XCircle class="w-6 h-6 shrink-0" />
          <div>
            <p class="text-sm">データの読み込みに失敗しました。以下の確認をお願いします。</p>
            <p class="text-xs">Failed to load data. Please check the following.</p>
          </div>
        </div>

        <!-- 確認事項 -->
        <section class="rounded-lg border border-base-300 bg-base-200 p-4">
          <h3 class="mb-3 flex items-center gap-2 font-bold">
            <ChevronRight class="w-5 h-5 shrink-0" />
            確認事項
            <span class="text-sm font-normal">/ Checklist</span>
          </h3>

          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3">
              <span class="badge badge-neutral badge-sm shrink-0 mt-0.5">1</span>
              <div>
                <p>わんコメが正常に起動していることを確認してください</p>
                <p class="text-xs">Make sure OneComme is running properly.</p>
              </div>
            </div>

            <div v-if="isPlugin" class="flex items-start gap-3">
              <span class="badge badge-neutral badge-sm shrink-0 mt-0.5">2</span>
              <div>
                <p>
                  <strong>{{ pluginName || '該当するプラグイン' }}</strong>
                  がインストールされ、有効になっているか確認してください
                </p>
                <p class="text-xs">
                  Check that
                  <strong>{{ pluginName || 'the relevant plugin' }}</strong>
                  is installed and enabled.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- エラー解決のヒント -->
        <section class="rounded-lg border border-info bg-base-200 p-4">
          <h3 class="mb-3 flex items-center gap-2 font-bold text-info">
            <Lightbulb class="w-5 h-5 shrink-0" />
            エラー解決のヒント
            <span class="text-sm font-normal">/ Troubleshooting tip</span>
          </h3>

          <div class="flex items-start gap-3 text-sm">
            <span class="badge badge-info badge-sm shrink-0 mt-0.5">!</span>
            <div>
              <p>
                OBSでの使用時は
                <strong>コンソールログ</strong>
                をご確認ください（OBS設定画面の「ログの表示」）。
              </p>
              <p class="text-xs">
                When using OBS, please check the console log ("Show Log" in the OBS settings window).
              </p>
            </div>
          </div>
        </section>

        <!-- エラー詳細 -->
        <div v-if="errorDetail" class="text-sm">
          <p class="font-bold text-warning">エラー詳細 / Error Details</p>
          <pre class="mt-1 whitespace-pre-wrap break-all text-xs">{{ errorDetail }}</pre>
        </div>

        <!-- 再読み込み -->
        <div class="flex justify-center">
          <button type="button" class="btn btn-primary" @click="handleReload">
            <RotateCcw class="w-5 h-5" />
            再読み込み
            <span class="text-sm font-normal">/ Reload</span>
          </button>
        </div>

        <!-- 自動リロード -->
        <p class="flex items-center justify-center gap-2 text-center text-xs">
          <Clock class="w-4 h-4 shrink-0" />
          15秒後に自動で再読み込みされます
          <span>/ Reloads automatically in 15 seconds</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { AlertTriangle, XCircle, ChevronRight, Lightbulb, RotateCcw, Clock } from 'lucide-vue-next'

  defineProps<{
    isPlugin?: boolean
    pluginName?: string
    errorDetail?: string
  }>()

  const rootEl = ref<HTMLElement | null>(null)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  const isXs = computed(() => containerWidth.value < 200 || containerHeight.value < 100)

  let resizeObserver: ResizeObserver | null = null
  let reloadTimer: ReturnType<typeof setTimeout> | null = null

  const handleReload = () => {
    window.location.reload()
  }

  onMounted(() => {
    if (!rootEl.value) return

    resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return

      containerWidth.value = entry.contentRect.width
      containerHeight.value = entry.contentRect.height
    })

    resizeObserver.observe(rootEl.value)

    reloadTimer = setTimeout(handleReload, 15_000)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()

    if (reloadTimer) {
      clearTimeout(reloadTimer)
    }
  })
</script>
