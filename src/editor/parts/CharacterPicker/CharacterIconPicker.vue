<!-- src/editor/parts/CharacterPicker/CharacterIconPicker.vue -->
<template>
  <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1" role="radiogroup">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      role="radio"
      :aria-checked="characterKey === item.key"
      :aria-haspopup="isIconKey && item.icons.length > 1 ? 'listbox' : undefined"
      :title="item.name"
      class="flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition cursor-pointer"
      :class="characterKey === item.key ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
      :style="{ width: `${size + 16}px` }"
      @mouseenter="scheduleOpen(item, $event)"
      @mouseleave="scheduleClose"
      @focus="scheduleOpen(item, $event)"
      @blur="scheduleClose"
      @keydown.esc="closeNow"
      @click="selectDefault(item)"
    >
      <LayerImage v-if="displayLayers(item).length" :layers="displayLayers(item)" :size="size" />
      <div
        v-else
        class="flex items-center justify-center rounded bg-base-200 text-xs opacity-60"
        :style="{ width: `${size}px`, height: `${size}px` }"
      >
        画像なし
      </div>
      <span class="w-full truncate text-center text-xs">{{ item.name }}</span>
      <!-- 選択中のキャラだけ、現在の表情名を出す -->
      <span v-if="isIconKey && characterKey === item.key" class="w-full truncate text-center text-[10px] text-primary">
        {{ currentIconLabel(item) }}
      </span>
    </button>
  </div>

  <IconPopup
    v-if="isIconKey && activeItem"
    :item="activeItem"
    :selected-character-key="characterKey"
    :selected-icon-key="iconKey"
    :icon-size="iconSize"
    :popup-style="popupStyle"
    :theme="theme"
    @select="selectIcon(activeItem, $event)"
    @enter="keepOpen"
    @leave="scheduleClose"
  />
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import IconPopup from './IconPopup.vue'
  import { useCharacterItems } from './useCharacterItems'
  import { useIconPopup } from './useIconPopup'
  import type { CharacterItem, SelectPayload } from './types'

  const props = withDefaults(
    defineProps<{
      characterKey: string
      iconKey?: string // isIconKey が false なら不要
      isIconKey?: boolean // 表情(icon)も選ばせるか
      size?: number // キャラサムネイルの一辺(px)
      iconSize?: number // 表情サムネイルの一辺(px)
    }>(),
    { iconKey: '', isIconKey: true, size: 64, iconSize: 56 }
  )

  const emit = defineEmits<{
    select: [payload: SelectPayload]
  }>()

  const { items } = useCharacterItems()
  const { activeItem, popupStyle, theme, scheduleOpen, scheduleClose, keepOpen, closeNow } = useIconPopup(
    items,
    toRef(props, 'isIconKey')
  )

  // 常時表示の画像: 選択中のキャラは選択した表情、それ以外は default
  const displayLayers = (item: CharacterItem) => {
    if (props.isIconKey && props.characterKey === item.key) {
      const selected = item.icons.find((i) => i.key === props.iconKey)
      if (selected) return selected.layers
    }
    return item.defaultLayers
  }

  const currentIconLabel = computed(
    () => (item: CharacterItem) => item.icons.find((i) => i.key === props.iconKey)?.label ?? ''
  )

  const selectDefault = (item: CharacterItem) => {
    closeNow()
    emit('select', props.isIconKey ? { characterKey: item.key, iconKey: item.defaultKey } : { characterKey: item.key })
  }

  const selectIcon = (item: CharacterItem, iconKey: string) => {
    closeNow()
    emit('select', { characterKey: item.key, iconKey })
  }
</script>
