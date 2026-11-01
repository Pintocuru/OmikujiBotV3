<!-- src/editor/helpers/CharacterChanger/InvalidCharacterAlert.vue -->
<template>
  <div class="alert alert-error">
    <AlertTriangle class="w-4 h-4" />
    <div class="flex-1">
      <span class="font-semibold">{{ t('characterChanger.invalidAlert.title') }}</span>
      <p class="text-sm mt-1">{{ t('characterChanger.invalidAlert.description') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { AlertTriangle } from 'lucide-vue-next'

  const { t } = useI18n()
</script>
