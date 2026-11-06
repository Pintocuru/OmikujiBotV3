<!-- src/common/LayerImage/ImagePreview.vue -->
<template>
  <div
    role="button"
    tabindex="0"
    aria-label="画像を拡大表示"
    class="cursor-pointer"
    @click="showPreview = true"
    @keydown.enter.prevent="showPreview = true"
    @keydown.space.prevent="showPreview = true"
  >
    <LayerImage :layers="layers" :width="width" :animation="animation" />
  </div>

  <Transition name="fade">
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showPreview = false"
    >
      <div class="relative bg-white rounded overflow-hidden">
        <!-- 正方形コンテナに object-contain で収め、縦横比を維持したまま潰れないようにする -->
        <LayerImage :layers="layers" :size="256" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, ref, watch } from 'vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { CharacterAnimationType } from '@/types/OmikujiData'

  defineProps<{
    layers: string[] | string
    width: number // 表示サイズ
    animation?: CharacterAnimationType
  }>()

  const showPreview = ref(false)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') showPreview.value = false
  }

  watch(showPreview, (v) => {
    if (v) window.addEventListener('keydown', onKeyDown)
    else window.removeEventListener('keydown', onKeyDown)
  })
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
