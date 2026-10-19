<!-- src/editor/apps/appItems/preview/BaseSettings.vue -->
<template>
  <div class="text-xs space-y-1 max-w-xs">
    <!-- name -->
    <div class="font-semibold truncate">
      {{ data.name || '(no name)' }}
    </div>

    <!-- key -->
    <div class="opacity-60 break-all">
      {{ data.key }}
    </div>

    <!-- description -->
    <div class="opacity-70 line-clamp-3">
      {{ data.description || t('appPreview.base.noDescription') }}
    </div>

    <!-- tags -->
    <div class="flex flex-wrap gap-1">
      <span v-for="tag in data.tags" :key="tag" class="badge badge-xs">
        {{ tag }}
      </span>
    </div>

    <!-- isEnabled -->
    <div class="pt-1">
      <span class="badge badge-xs" :class="data.isEnabled ? 'badge-success' : 'badge-ghost'">
        {{ data.isEnabled ? t('appPreview.base.enabled') : t('appPreview.base.disabled') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { BaseRecordType } from '@/types/core'

  const { t } = useI18n()

  defineProps<{
    data: BaseRecordType
  }>()
</script>
