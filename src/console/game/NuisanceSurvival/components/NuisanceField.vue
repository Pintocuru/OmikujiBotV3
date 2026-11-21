<!-- src/console/game/NuisanceSurvival/components/NuisanceField.vue -->
<!-- 盤面の表示。Excalibur の起動と破棄だけを担当する (描画・演出は ../render/NuisanceStage.ts)。画面の大きさに合わせて縮尺が変わる -->
<template>
  <div class="h-full w-full">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { DEFAULT_GRID } from '../scripts/nuisanceEngine'
  import { NuisanceStage, type StageSource } from '../render/NuisanceStage'

  const props = defineProps<{ source: StageSource }>()

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let stage: NuisanceStage | null = null

  onMounted(() => {
    if (canvasRef.value) stage = new NuisanceStage(canvasRef.value, DEFAULT_GRID, props.source)
  })
  onBeforeUnmount(() => {
    stage?.dispose()
    stage = null
  })
</script>
