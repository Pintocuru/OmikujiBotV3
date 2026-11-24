<!-- src/console/game/WordAlchemy/components/WordAlchemyField.vue -->
<!-- 盤面の表示。Excalibur の起動と破棄だけを担当する (進行・描画は ../render/WordAlchemyStage.ts)。画面の大きさに合わせて縮尺が変わる -->
<template>
  <div class="h-full w-full">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { WordAlchemyStage, type StageOptions } from '../render/WordAlchemyStage'

  const props = defineProps<{ options: StageOptions }>()
  const emit = defineEmits<{ ready: [stage: WordAlchemyStage] }>()

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let stage: WordAlchemyStage | null = null

  onMounted(() => {
    if (!canvasRef.value) return
    stage = new WordAlchemyStage(canvasRef.value, props.options)
    emit('ready', stage)
  })
  onBeforeUnmount(() => {
    stage?.dispose()
    stage = null
  })
</script>
