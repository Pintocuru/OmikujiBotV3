<!-- src/console/game/OshikuraChain/components/OshikuraChainTitle.vue -->
<!-- タイトル画面。星間旅行の背景にタイトル画像を重ね、クリックでメニューを開く -->
<template>
  <button
    type="button"
    class="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-6"
    aria-label="スタートメニューを開く"
    @click="emit('openMenu')"
  >
    <img
      v-if="!imageUnavailable"
      class="max-h-[75%] max-w-full object-contain"
      :src="titleImagePath"
      alt=""
      aria-hidden="true"
      @error="imageUnavailable = true"
    />

    <span v-else class="text-5xl font-black tracking-widest"> おしくらチェイン </span>

    <span
      class="animate-pulse text-xl font-bold tracking-[0.5em] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
    >
      PUSH START
    </span>
  </button>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { getImagePath } from '@/common/AppEnv'

  const emit = defineEmits<{ openMenu: [] }>()

  // 実ファイル: assets/images/2026-Q4/OshikuraChain/title.webp
  // 実行時 URL: images/OshikuraChain/title.webp (四半期名は URL に含めない)
  const titleImagePath = getImagePath('OshikuraChain/title.webp')
  const imageUnavailable = ref(false)
</script>
