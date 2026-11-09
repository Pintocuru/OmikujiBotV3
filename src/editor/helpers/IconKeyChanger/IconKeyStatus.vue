<!-- src/editor/helpers/IconKeyChanger/IconKeyStatus.vue -->
<!-- 不正な iconKey の件数と、警告(なければ「すべて有効」) -->
<template>
  <template v-if="invalidCount > 0">
    <div class="stats shadow w-full">
      <div class="stat bg-error/10">
        <div class="stat-title">{{ t('iconKeyChanger.invalidStatistics') }}</div>
        <div class="stat-value text-error">{{ invalidCount }}</div>
      </div>
    </div>

    <div class="alert alert-error">
      <AlertTriangle class="w-4 h-4" />
      <div class="flex-1">
        <span class="font-semibold">{{ t('iconKeyChanger.invalidAlert.title') }}</span>
        <p class="text-sm mt-1">{{ t('iconKeyChanger.invalidAlert.description') }}</p>
      </div>
    </div>
  </template>

  <div v-else class="alert alert-success">
    <span>{{ t('iconKeyChanger.validAlert') }}</span>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { AlertTriangle } from 'lucide-vue-next'

  const { t } = useI18n()

  defineProps<{
    invalidCount: number
  }>()
</script>
