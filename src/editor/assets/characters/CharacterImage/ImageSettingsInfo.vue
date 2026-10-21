<!-- src/editor/assets/characters/CharacterImage/ImageSettingsInfo.vue -->
<template>
  <InformationCard>
    <p>
      {{ t('characterImage.info.line1Pre') }}
      <code class="label bg-accent text-accent-content">{{ t('characterImage.info.code1') }}</code>
      {{ t('characterImage.info.line1Post') }}
    </p>

    <p>
      {{ t('characterImage.info.line2Pre') }}
      <button class="btn btn-ghost btn-xs px-1 py-0 h-auto min-h-0 text-xs" :title="t('characterImage.info.setPathTip')">
        <RotateCcw class="w-3 h-3 mr-1" />
        {{ t('characterImage.layer.setPath') }}
      </button>
      {{ t('characterImage.info.line2Mid') }}
      <code class="label bg-accent text-accent-content">{{ t('characterImage.info.code2') }}</code>
      {{ t('characterImage.info.line2Post') }}
    </p>
    <p class="mt-2 text-sm">
      <strong>{{ t('characterImage.info.layerFeature') }}</strong> {{ t('characterImage.info.layerDesc') }}
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import { RotateCcw } from 'lucide-vue-next'

  const { t } = useI18n()
</script>
