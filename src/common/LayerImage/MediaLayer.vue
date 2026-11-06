<!-- src/common/LayerImage/MediaLayer.vue -->
<template>
  <video
    v-if="isVideo"
    :src="src"
    autoplay
    muted
    loop
    playsinline
    class="object-contain w-full h-full"
    @error="emit('error')"
  />
  <img v-else :src="src" class="object-contain w-full h-full" @error="emit('error')" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    src: string
  }>()
  const emit = defineEmits<{
    error: []
  }>()

  // クエリ文字列（?v= 等）付きでも動画と判定できるように末尾一致を緩める
  const isVideo = computed(() => /\.(webm|mp4)(?:[?#].*)?$/i.test(props.src))
</script>
