<!-- src/common/LayerImage/LayerImage.vue -->
<template>
  <div class="relative grid" :style="containerStyle">
    <div
      v-for="(src, i) in sources"
      :key="i"
      class="col-start-1 row-start-1 animate__animated"
      :class="animationClass"
      :style="{ ...animationStyle, zIndex: sources.length - i }"
    >
      <MediaLayer class="w-full h-full" :src="src" @error="onError(i)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterAnimationType } from '@/types/OmikujiData'
  import { loopMotionMap } from '@/maps/OmikujiData'
  import MediaLayer from './MediaLayer.vue'
  import { useImageSources } from './useImageSources'
  import 'animate.css'
  import './animations.css'

  const props = defineProps<{
    layers: string[] | string
    size?: number | string // 正方形サイズ（数値は px 扱い）
    width?: number | string // 縦横比が異なる場合の個別指定（size より優先）
    height?: number | string
    animation?: CharacterAnimationType
  }>()

  const toCssUnit = (val?: number | string): string | undefined => {
    if (val === undefined || val === null) return undefined
    return typeof val === 'number' ? `${val}px` : val
  }

  const containerStyle = computed(() => {
    const w = toCssUnit(props.width) ?? toCssUnit(props.size) ?? '100%'
    const h = toCssUnit(props.height) ?? toCssUnit(props.size) ?? '100%'
    return {
      width: w,
      height: h,
    }
  })

  const { sources, onError } = useImageSources(() => props.layers)

  const animationClass = computed(() => {
    const anim = props.animation
    if (!anim || anim.type === 'none') return ''
    const entry = loopMotionMap[anim.type]
    return [entry.variant, anim.loop ? 'animate__infinite' : ''].filter(Boolean).join(' ')
  })

  const animationStyle = computed(() => {
    const anim = props.animation
    if (!anim || anim.type === 'none') return {}
    const duration = `${anim.duration ?? 1.5}s`
    const iteration = anim.loop ? 'infinite' : '1'
    return {
      '--anim-duration': duration,
      '--anim-iteration-count': iteration,
      '--animate-duration': duration,
      '--animate-iteration-count': iteration,
    }
  })
</script>

<style scoped>
  @media (prefers-reduced-motion: reduce) {
    .animate__animated {
      animation-duration: var(--animate-duration) !important;
      animation-iteration-count: var(--animate-iteration-count) !important;
      transition-duration: var(--animate-duration) !important;
    }
  }
</style>
