<!-- src/ui/KujibikiPanel/components/fortune/BigBangResult.vue -->
<!-- おみくじ結果(slot0) -->
<template>
  <div class="result-plaque relative z-10 flex min-h-24 w-full items-center justify-center rounded-lg px-3 py-3">
    <span class="result-text relative block w-full text-center font-black tracking-wide" :style="{ fontSize }">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{ text: string }>()

  // 短い結果は大きく、長い結果は最大3行に収まるよう段階的に縮小する
  const fontSize = computed(() => {
    const length = [...props.text].length
    if (length <= 4) return '3.25rem'
    if (length <= 8) return '2.75rem'
    if (length <= 14) return '2.25rem'
    return '0.9rem'
  })
</script>

<style scoped>
  .result-plaque {
    border: 1px solid rgba(186, 230, 253, 0.55);
    background: linear-gradient(145deg, rgba(8, 47, 73, 0.92), rgba(15, 23, 42, 0.96));
    box-shadow:
      0 0 20px rgba(14, 165, 233, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .result-text {
    color: #e0f2fe;
    line-height: 1.2;
    overflow-wrap: anywhere;
    text-shadow: 0 0 10px rgba(56, 189, 248, 0.65);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
</style>
