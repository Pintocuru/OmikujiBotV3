<!-- src/ui/CommentBubble/components/standard/CommentBubbleItem.vue -->
<template>
  <div
    class="relative transparent-bg inline-block max-w-3xl min-w-40 rounded-xl px-5 pt-6 pb-4"
    :class="brightness"
    :style="bubbleStyle"
  >
    <!-- 名前表示(アクセント色のドットを添える) -->
    <div v-if="botName" class="mb-1 flex items-center gap-2 text-base font-bold" :style="{ color: color.name }">
      <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: color.accent }" />
      {{ botName }}
    </div>

    <!-- コメント内容（HTML を描画） -->
    <div class="wrap-break-word text-xl" :style="{ color: color.text }" v-html="message" />

    <!-- 吹き出しの矢印 -->
    <div v-if="arrow" :class="arrow.class" :style="arrow.style" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/'

  const props = withDefaults(
    defineProps<{
      botName: string | null
      message: string
      color?: CharacterColorType
      brightnessLevel?: number
      arrowDirection?: 'down' | 'left' | 'right' | 'none' // 矢印の向き(left=吹き出しの左側に出て左を指す)
    }>(),
    {
      color: () => CharacterColorScheme.parse({}),
      brightnessLevel: 0,
      arrowDirection: 'down',
    }
  )

  // Brightness(吹き出し全体に 1 回だけ掛ける。子要素の文字・矢印にも効くので、子には付けない)
  const BRIGHTNESS_CLASSES = ['', 'brightness-90', 'brightness-75', 'brightness-50', 'brightness-[30%]'] as const

  const brightness = computed(() => {
    if (props.brightnessLevel == null) return undefined
    return BRIGHTNESS_CLASSES[Math.min(props.brightnessLevel, BRIGHTNESS_CLASSES.length - 1)]
  })

  // 背景色と、上辺のアクセント帯(矢印は下・左・右にしか出ないので、上辺なら干渉しない)
  const bubbleStyle = computed(() => ({
    backgroundColor: props.color.background,
    '--bubble-bg': props.color.background,
    boxShadow: `inset 0 6px 0 0 ${props.color.accent}`,
  }))

  // 矢印(向きごとのクラスと、吹き出しの色を付ける border の辺(矢印の向きと逆側))
  const ARROWS = {
    down: {
      class: '-bottom-5 left-1/2 -translate-x-1/2 border-x-[20px] border-t-[20px] border-x-transparent',
      colorProp: 'borderTopColor',
    },
    left: {
      class: '-left-5 top-1/2 -translate-y-1/2 border-y-[16px] border-r-[20px] border-y-transparent',
      colorProp: 'borderRightColor',
    },
    right: {
      class: '-right-5 top-1/2 -translate-y-1/2 border-y-[16px] border-l-[20px] border-y-transparent',
      colorProp: 'borderLeftColor',
    },
  } as const

  const arrow = computed(() => {
    if (props.arrowDirection === 'none') return null
    const { class: classes, colorProp } = ARROWS[props.arrowDirection]
    return { class: `absolute w-0 h-0 ${classes}`, style: { [colorProp]: 'var(--bubble-bg)' } }
  })
</script>
