<!-- src/DevApp.vue -->
<template>
  <App />
</template>

<script setup lang="ts">
  // 開発版と製品版で同じ画面にするため、中身は editor/App.vue に集約している
  import App from '@/editor/App.vue'
</script>
