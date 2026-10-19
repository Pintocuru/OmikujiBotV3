<!-- src/editor/assets/PostFlow/preview/SoundTestButton.vue -->
<template>
  <!-- サウンドのテスト実行 -->
  <button @click="handleClick" :disabled="!sound && !soundPath" class="btn btn-xs btn-secondary">
    {{ t('postFlow.tests.sound') }}
  </button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { SoundKeyType } from '@/types/OmikujiData'
  import { playSoundResolved } from '@/common/sounds'

  const { t } = useI18n()

  const props = defineProps<{
    sound: SoundKeyType | ''
    soundPath: string
  }>()

  // pattern をサウンド名として再生
  function handleClick() {
    playSoundResolved(props.sound, props.soundPath)
  }
</script>
