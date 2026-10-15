<!-- src/editor/assets/PostFlow/preview/SoundTestButton.vue -->
<template>
  <button @click="handleClick" :disabled="!sound && !soundPath" class="btn btn-xs btn-secondary">
    サウンドのテスト実行
  </button>
</template>

<script setup lang="ts">
  import { playSoundResolved } from '@/common/sounds'
  import { SoundKeyType } from '@/types/OmikujiData'

  const props = defineProps<{
    sound: SoundKeyType | ''
    soundPath: string
  }>()

  // pattern をサウンド名として再生
  function handleClick() {
    playSoundResolved(props.sound, props.soundPath)
  }
</script>
