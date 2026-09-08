<!-- src/common/ErrorInfo/ErrorInfo.vue -->
<template>
  <div class="bg-white border border-red-300 rounded-lg shadow-lg overflow-hidden">
    <!-- ヘッダー -->
    <div class="bg-red-500 text-white px-6 py-4">
      <h2 class="flex items-center justify-center text-xl font-semibold gap-2">
        <AlertTriangle class="h-6 w-6" />
        読み込みエラー
      </h2>
    </div>

    <div class="p-6">
      <!-- エラー説明 -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <XCircle class="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <p class="text-red-800 text-sm">データの読み込みに失敗しました。以下の確認をお願いします。</p>
        </div>
      </div>

      <!-- 確認事項セクション -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h3 class="font-bold text-gray-800 mb-3 flex items-center">
          <ChevronRight class="h-5 w-5 mr-2 text-gray-600" />
          確認事項
        </h3>

        <div class="space-y-3 text-sm">
          <div class="flex items-start gap-3">
            <span
              class="inline-flex items-center justify-center h-5 w-5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full flex-shrink-0 mt-0.5"
              >1</span
            >
            <span class="text-gray-700">わんコメが正常に起動していることを確認してください</span>
          </div>

          <!-- プラグイン関連の情報表示 -->
          <template v-if="isPlugin">
            <div class="flex items-start gap-3">
              <span
                class="inline-flex items-center justify-center h-5 w-5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full flex-shrink-0 mt-0.5"
                >2</span
              >
              <span class="text-gray-700">
                <span class="font-bold">{{ pluginName ? pluginName : '該当するプラグイン' }}</span>
                がインストール、有効になっているか確認してください</span
              >
            </div>
          </template>
        </div>
      </div>

      <!-- エラー解決のヒント -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="font-bold text-blue-800 mb-3 flex items-center">
          <Lightbulb class="h-5 w-5 mr-2 text-blue-600" />
          エラー解決のヒント
        </h3>

        <div class="flex items-start gap-3 text-sm">
          <span
            class="inline-flex items-center justify-center h-5 w-5 bg-blue-200 text-blue-700 text-xs font-bold rounded-full flex-shrink-0 mt-0.5"
            >!</span
          >
          <span class="text-blue-800">
            OBSでの使用時は<span class="font-bold">コンソールログ</span>をご確認ください（OBS設定画面の「ログの表示」）
          </span>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="flex justify-center mb-4">
        <button
          @click="handleReload"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <RotateCcw class="h-5 w-5" />
          再読み込み
        </button>
      </div>

      <!-- 自動リロードの表示 -->
      <div class="text-center">
        <div class="inline-flex items-center gap-2 text-xs text-gray-500">
          <Clock class="h-4 w-4" />
          <span>15秒後に自動で再読み込みされます</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { AlertTriangle, XCircle, ChevronRight, Lightbulb, RotateCcw, Clock } from 'lucide-vue-next'

  // プラグインIDを受け取るプロパティ
  const props = defineProps<{
    isPlugin?: boolean
    pluginName?: string
  }>()

  // 再読み込み処理
  const handleReload = () => {
    window.location.reload()
  }

  // 15秒後に自動リロード
  onMounted(() => {
    setTimeout(() => {
      handleReload()
    }, 15000)
  })
</script>
