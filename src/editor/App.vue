<!-- src/editor/App.vue -->
<!-- 製品版・開発版の最上位。エディター(EditorApp)とジェネレーター表示を切り替える -->
<template>
  <!-- ボタンや HUD のテーマを、エディター本体(EditorApp.vue)と同じにする -->
  <div :data-theme="daisyUiTheme">
    <!-- エディター: 切り替えで再読み込みが走らないよう、v-show で常に残す -->
    <div v-show="!showGenerator">
      <EditorApp />
    </div>

    <!-- ジェネレーター＋ツール: 初めて開くときに読み込む -->
    <GeneratorView v-if="showGenerator" />

    <!-- 切り替えボタン -->
    <ShellToolbar v-model:showGenerator="showGenerator" :generatorState="generatorState" @recheck="checkOneComme" />
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import EditorApp from './EditorApp.vue'
  import ShellToolbar from './shell/ShellToolbar.vue'
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
