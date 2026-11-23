<!-- src/console/game/OshikuraChain/components/NuisanceField.vue -->
<!-- 盤面の表示。Excalibur の起動と破棄だけを担当する (描画・演出は ../render/OshikuraChainStage.ts)。画面の大きさに合わせて縮尺が変わる -->
<template>
  <div class="h-full w-full">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { DEFAULT_GRID } from '../scripts/nuisanceEngine'
  import { OshikuraChainStage, type OshikuraChainStageSource } from '../render/OshikuraChainStage'

  const props = defineProps<{ source: OshikuraChainStageSource }>()

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let stage: OshikuraChainStage | null = null

  onMounted(() => {
    if (canvasRef.value) stage = new OshikuraChainStage(canvasRef.value, DEFAULT_GRID, props.source)
  })
  onBeforeUnmount(() => {
    stage?.dispose()
    stage = null
  })
</script>
