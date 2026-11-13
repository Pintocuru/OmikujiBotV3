<!-- src/ui/LiverBingo/components/LiverBingoTitle.vue -->
<template>
  <div class="lb-title" :class="{ 'lb-title--effect': showEffect }">
    <!-- 未達成のマスをランダムに光らせる -->
    <button type="button" class="lb-title__button" aria-label="Random" @click="emit('random-select')">[R]</button>

    <!-- 右クリックでカードを作り直す -->
    <div
      class="lb-title__text"
      :class="{ 'lb-title__text--effect': showEffect }"
      @contextmenu.prevent="emit('generate')"
    >
      {{ showEffect ? `${lineCount}ライン!!` : title }}
    </div>

    <!-- タイトルを中央に置くための余白(ボタンと同じ幅) -->
    <span class="lb-title__spacer" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    lineCount: number
    showEffect: boolean
  }>()

  const emit = defineEmits<{
    'random-select': []
    generate: []
  }>()
</script>

<style scoped>
  .lb-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.25rem 1rem;
    border-radius: 0.5rem;
    background: var(--lb-accent);
    color: var(--lb-name);
    transition: background-color 0.5s;
  }
  .lb-title--effect {
    background: color-mix(in srgb, var(--lb-accent) 60%, var(--lb-text));
  }
  .lb-title__button,
  .lb-title__spacer {
    width: 2.75rem;
    flex: none;
  }
  .lb-title__button {
    height: 2.25rem;
    border: 1px solid color-mix(in srgb, var(--lb-name) 40%, transparent);
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--lb-bg) 25%, transparent);
    color: inherit;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .lb-title__button:hover {
    transform: scale(1.05);
    background: color-mix(in srgb, var(--lb-bg) 45%, transparent);
  }
  .lb-title__text {
    flex: 1;
    text-align: center;
    font-size: 1.875rem;
    line-height: 2.25rem;
    transition: transform 0.5s;
  }
  .lb-title__text--effect {
    transform: scale(1.1);
  }
</style>
