<!-- src/console/game/OshikuraChain/components/OshikuraChainTitle.vue -->
<!-- タイトル画面。星間旅行の背景にタイトル画像を重ね、クリックでメニューを開く -->
<template>
  <button
    type="button"
    class="absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
    aria-label="スタートメニューを開く"
    @click="emit('openMenu')"
  >
    <img
      v-if="!imageUnavailable"
      class="pointer-events-none h-full w-full object-contain"
      :src="titleImagePath"
      alt=""
      aria-hidden="true"
      @error="imageUnavailable = true"
    />
    <span v-else class="pointer-events-none text-5xl font-black tracking-widest">
      おしくらチェイン
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
