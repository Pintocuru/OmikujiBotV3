<!-- src/editor/events/core/DisabledEventNotice.vue -->
<template>
  <InformationCard variant="error" class="mt-4 p-4">
    {{ t('itemEditor.disabledNotice.title') }}<br />
    {{ t('itemEditor.disabledNotice.action') }}
  </InformationCard>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import InformationCard from '@/editor/parts/InformationCard.vue'

  const { t } = useI18n()
</script>
