<!-- src/manager/components/OpenSourceBar.vue -->
<!-- 開く手段: どちらも同じ高さ・同じ見た目で並べる -->
<template>
  <div class="flex flex-wrap items-center gap-2 px-3 pt-3">
    <button class="btn btn-sm btn-outline" :disabled="devStore.isLoading" @click="emit('openLocal')">
      <FileCode class="w-4 h-4" />
      {{ t('shell.topBar.openLocal') }}
    </button>
    <button
      v-if="!devStore.isExpressMode"
      class="btn btn-sm btn-outline"
      :disabled="devStore.isLoading"
      :title="t('shell.topBar.openGeneratorTip')"
      @click="emit('openPackage')"
    >
      <Download class="w-4 h-4" />
      {{ t('shell.topBar.openGenerator') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Download, FileCode } from 'lucide-vue-next'
  import { useManagerStore } from '../stores/useManagerStore'

  const emit = defineEmits<{ openLocal: []; openPackage: [] }>()
  const { t } = useI18n()
  const devStore = useManagerStore()
</script>
