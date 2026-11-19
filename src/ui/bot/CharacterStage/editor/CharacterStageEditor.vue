<!-- src/ui/bot/CharacterStage/editor/CharacterStageEditor.vue -->
<template>
  <InformationCard variant="warning" icon="TriangleAlert">
    <p>
      {{ $t('uiSettings.characterStage.noSettings.line1') }}<br />
      {{ $t('uiSettings.characterStage.noSettings.line2') }}
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import InformationCard from '@/editor/parts/InformationCard.vue'
</script>
