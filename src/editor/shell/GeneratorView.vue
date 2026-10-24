<!-- src/editor/shell/GeneratorView.vue -->
<template>
  <!-- 左: ジェネレーターの表示ステージ / 右: ツール(重ならないよう横に並べる) -->
  <div class="flex h-screen bg-base-100 text-base-content">
    <div class="flex-1 min-w-0 p-2">
      <GeneratorStage>
        <GeneratorApp />
      </GeneratorStage>
    </div>

    <!-- ツール(右上は切り替えボタンが使うので、上を空ける) -->
    <aside v-show="showTools" class="w-104 shrink-0 overflow-y-auto space-y-2 pt-14 pr-2 pb-2">
      <TestComment />
      <VirtualStreamPanel />
      <EvaluationBlock />
      <button class="btn btn-sm btn-warning w-full" @click="resetAll">セッションリセット</button>
    </aside>

    <!-- ツールの表示切り替え -->
    <button
      class="btn btn-xs btn-outline fixed bottom-2 right-2 z-9999 bg-base-100"
      :title="showTools ? 'ツールを隠す' : 'ツールを表示'"
      @click="showTools = !showTools"
    >
      ツール {{ showTools ? '▶' : '◀' }}
    </button>
  </div>
</template>

<script setup lang="ts">
  // ! ジェネレーターに依存する部分(OneSDK を含む)はこのファイルに集約し、editor/App.vue から遅延読み込みする
  import { ref } from 'vue'
  import GeneratorApp from '@/generator/App.vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import GeneratorStage from './GeneratorStage.vue'
  import TestComment from '@/editor/dev/TestComment/TestComment.vue'
  import VirtualStreamPanel from '@/editor/dev/VirtualStreamPanel/VirtualStreamPanel.vue'
  import EvaluationBlock from '@/editor/dev/EvaluationBlock/EvaluationBlock.vue'

  const appStore = useAppStore()
  const showTools = ref(true)

  // セッションリセット
  function resetAll() {
    appStore.userStats.reset()
    appStore.streamStats.reset()
  }
</script>
