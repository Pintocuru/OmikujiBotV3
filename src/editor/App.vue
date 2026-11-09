<!-- src/editor/App.vue -->
<!-- 製品版・開発版の最上位。上部バーの下に、エディター(EditorApp)とジェネレーター表示を切り替えて出す -->
<template>
  <!-- 画面全体の高さとスクロール境界をここで管理する -->
  <div :data-theme="daisyUiTheme" class="flex h-screen min-w-0 flex-col overflow-hidden bg-base-100 text-base-content">
    <!-- 上部バー(常設) -->
    <TopBar v-model:showGenerator="showGenerator" :generatorState="generatorState" @recheck="checkOneComme" />

    <!-- 上部バーを除いた残りの領域。スクロールは各画面に任せる -->
    <div class="relative min-h-0 min-w-0 flex-1 overflow-hidden">
      <!-- エディター: 切り替えで再読み込みが走らないよう、v-show で常に残す -->
      <div v-show="!showGenerator" class="h-full min-h-0 min-w-0">
        <EditorApp />
      </div>

      <!-- ジェネレーター＋ツール: 初めて開くときに読み込む -->
      <div v-if="showGenerator" class="h-full min-h-0 min-w-0">
        <GeneratorView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import EditorApp from './EditorApp.vue'
  import TopBar from './shell/TopBar.vue'
  import type { GeneratorState } from './shell/shellTypes'
  import GeneratorLoading from './shell/GeneratorLoading.vue'
  import { PingOneSDK } from '@/sdk/connection/PingOneSDK'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

  // ジェネレーター(OneSDK を含む)は切り替えるまで読み込まない
  const GeneratorView = defineAsyncComponent({
    loader: () => import('./shell/GeneratorView.vue'),
    loadingComponent: GeneratorLoading,
  })

  const showGenerator = ref(false)

  // わんコメに接続できないときも、エディターは動かす(ジェネレーターの切り替えだけ使えなくする)
  const generatorState = ref<GeneratorState>('checking')
  async function checkOneComme() {
    generatorState.value = 'checking'
    generatorState.value = (await PingOneSDK()) ? 'ready' : 'unavailable'
  }
  onMounted(checkOneComme)

  // EditorApp.vue の daisyUiTheme と同じ
  const { data } = storeToRefs(useOmikujiStore())
  const daisyUiTheme = computed(() => data.value.settings.developer.daisyUiTheme)
</script>
