<!-- src/editor/parts/CharacterPicker/CharacterThumb.vue -->
<!-- キャラクター1体(または1表情)の小さな画像。キャラが未定義(または unknown 指定)ならハテナ、画像が無ければ ImageOff。
     表情は iconKey で指定したものだけを見る(無くても default には切り替えず「画像なし」として出す) -->
<template>
  <div class="shrink-0 overflow-hidden rounded bg-base-300" :style="{ width: `${size}px`, height: `${size}px` }">
    <LayerImage v-if="layers.length" :layers="layers" :size="size" />
    <div v-else class="flex h-full w-full items-center justify-center">
      <CircleHelp v-if="isUnknown" :size="iconPx" class="text-warning" />
      <ImageOff v-else :size="iconPx" class="opacity-50" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CircleHelp, ImageOff } from 'lucide-vue-next'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import type { CharacterType } from '@/types/OmikujiData'

  const props = withDefaults(
    defineProps<{
      character: CharacterType | null // 未定義なら null
      iconKey?: string // 表情キー(省略は default)
      unknown?: boolean // true ならキー自体が存在しないものとしてハテナを出す(不正な iconKey 用)
      size?: number // 一辺(px)
    }>(),
    { iconKey: 'default', unknown: false, size: 32 }
  )

  const isUnknown = computed(() => !props.character || props.unknown)

  const layers = computed(() => {
    const image = props.character?.image
    if (props.unknown || !image || !Object.prototype.hasOwnProperty.call(image, props.iconKey)) return []
    return image[props.iconKey].src.filter((path) => path && path.trim())
  })

  const iconPx = computed(() => Math.round(props.size * 0.55))
</script>
