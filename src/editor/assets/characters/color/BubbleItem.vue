<!-- src/ui/common/CommentBubbleItem.vue -->
<template>
  <div
    class="relative transparent-bg inline-block max-w-3xl min-w-40"
    :class="uiMap.bubble.class"
    :style="uiMap.bubble.style"
  >
    <!-- 名前表示 -->
    <div v-if="botName" class="font-bold" :class="[nameSize, uiMap.name.class]" :style="uiMap.name.style">
      {{ botName }}
    </div>

    <!-- コメント内容（HTML を描画） -->
    <div
      class="wrap-break-word"
      :class="[textSize, uiMap.text.class]"
      :style="uiMap.text.style"
      v-html="displayedHtml"
    />

    <!-- 吹き出しの矢印 -->
    <div v-if="arrowDirection !== 'none'" :class="uiMap.arrow.class" :style="uiMap.arrow.style" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/'
  import { createUiMap } from './UiBubbleMap.ts'

  const props = withDefaults(
    defineProps<{
      botName: string | null
      message: string
      color?: CharacterColorType
      brightnessLevel?: number
      customClasses?: string
      customArrowClasses?: string
      compact?: boolean // 小さめ表示(文字・余白・矢印を縮める)
      arrowDirection?: 'down' | 'left' | 'right' | 'none' // 矢印の向き(left=吹き出しの左側に出て左を指す)
      animatedText?: boolean
      animatedTextSpeed?: number
    }>(),
    {
      color: () => CharacterColorScheme.parse({}),
      brightnessLevel: 0,
      customClasses: undefined,
      customArrowClasses: undefined,
      compact: false,
      arrowDirection: 'down',
      animatedText: false,
      animatedTextSpeed: 50,
    }
  )

  // Brightness
  const BRIGHTNESS_CLASSES = ['', 'brightness-90', 'brightness-75', 'brightness-50', 'brightness-[30%]'] as const

  const brightness = computed(() => {
    if (props.brightnessLevel == null) return undefined
    return BRIGHTNESS_CLASSES[Math.min(props.brightnessLevel, BRIGHTNESS_CLASSES.length - 1)]
  })

  // サイズ
  const textSize = computed(() => (props.compact ? 'text-base' : 'text-xl'))
  const nameSize = computed(() => (props.compact ? 'text-sm' : 'text-xl'))

  // 矢印(向きごとの既定クラス。customArrowClasses を渡した場合はそちらを優先)
  const ARROW_CLASSES = {
    down: {
      normal: '-bottom-5 left-1/2 -translate-x-1/2 border-x-[20px] border-t-[20px] border-x-transparent',
      compact: '-bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-t-[12px] border-x-transparent',
    },
    left: {
      normal: '-left-5 top-1/2 -translate-y-1/2 border-y-[16px] border-r-[20px] border-y-transparent',
      compact: '-left-3 top-1/2 -translate-y-1/2 border-y-[10px] border-r-[12px] border-y-transparent',
    },
    right: {
      normal: '-right-5 top-1/2 -translate-y-1/2 border-y-[16px] border-l-[20px] border-y-transparent',
      compact: '-right-3 top-1/2 -translate-y-1/2 border-y-[10px] border-l-[12px] border-y-transparent',
    },
  } as const

  const ARROW_SIDE = { down: 'top', left: 'right', right: 'left', none: 'top' } as const

  const arrowClasses = computed(() => {
    if (props.customArrowClasses) return props.customArrowClasses
    if (props.arrowDirection === 'none') return ''
    return `absolute w-0 h-0 ${ARROW_CLASSES[props.arrowDirection][props.compact ? 'compact' : 'normal']}`
  })

  const uiMap = computed(() =>
    createUiMap({
      color: props.color,
      brightness: brightness.value,
      customClasses: props.customClasses ?? (props.compact ? 'px-3 py-2 rounded-lg' : 'p-4 rounded-xl'),
      customArrowClasses: arrowClasses.value,
      arrowSide: ARROW_SIDE[props.arrowDirection],
    })
  )

  // アニメーション
  const displayedHtml = ref(props.animatedText ? '' : props.message)
  const isHtml = computed(() => props.message.includes('<'))

  watchEffect(() => {
    // HTML を含む場合はアニメーション禁止（そのまま表示）
    if (!props.animatedText || isHtml.value) {
      displayedHtml.value = props.message
      return
    }

    // ここから先は「プレーンテキストのみ」アニメーション
    displayedHtml.value = ''
    let i = 0
    const timer = setInterval(() => {
      displayedHtml.value = props.message.substring(0, i++)
      if (i > props.message.length) clearInterval(timer)
    }, props.animatedTextSpeed)
  })
</script>
