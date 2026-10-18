<!-- src/editor/assets/PostFlow/preview/SoundTestButton.vue -->
<template>
  <!-- サウンドのテスト実行 -->
  <button @click="handleClick" :disabled="!sound && !soundPath" class="btn btn-xs btn-secondary">
    サウンドのテスト実行
  </button>
</template>

<script setup lang="ts">
  import { SoundKeyType } from '@/types/OmikujiData'
  import { playSoundResolved } from '@/common/sounds'

  const props = defineProps<{
    sound: SoundKeyType | ''
    soundPath: string
  }>()

  // pattern をサウンド名として再生
  function handleClick() {
    playSoundResolved(props.sound, props.soundPath)
  }
</script>
