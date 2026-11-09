<!-- src/editor/assets/characters/CharacterImage/ImageSettingsInfo.vue -->
<!-- 画像設定のヘルプの中身 (HelpButton のスロットに入れて使う) -->
<template>
  <p>
    {{ t('characterImage.help.placePre') }}
    <code class="label bg-accent text-accent-content">{{ t('characterImage.help.placeCode') }}</code>
    {{ t('characterImage.help.placePost') }}
  </p>
  <p>{{ t('characterImage.help.detect', { button: t('characterImage.layer.detect') }) }}</p>
  <p>{{ t('characterImage.help.pick', { button: t('characterImage.layer.candidates') }) }}</p>
  <p>{{ t('characterImage.help.status') }}</p>
  <p>
    <strong>{{ t('characterImage.help.layerFeature') }}</strong> {{ t('characterImage.help.layerDesc') }}
  </p>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>
