<!-- src/editor/shell/GeneratorLoading.vue -->
<template>
  <div class="p-4 text-sm opacity-60">{{ t('shell.generator.loading') }}</div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>
