<!-- src/editor/parts/CharacterPicker/IconPopup.vue -->
<template>
  <Teleport to="body">
    <div
      class="fixed z-1000 rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-xl"
      :data-theme="theme"
      :style="popupStyle"
      role="listbox"
      :aria-label="item.name"
      @mouseenter="emit('enter')"
      @mouseleave="emit('leave')"
    >
      <p class="mb-1 px-1 text-xs font-bold opacity-70">{{ item.name }}</p>
      <div class="flex max-h-60 flex-wrap gap-1 overflow-y-auto">
        <button
          v-for="icon in item.icons"
          :key="icon.key"
          type="button"
          role="option"
          :aria-selected="isSelected(icon.key)"
          class="flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition cursor-pointer"
          :class="isSelected(icon.key) ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
          :style="{ width: `${iconSize + 16}px` }"
          @click="emit('select', icon.key)"
        >
          <LayerImage :layers="icon.layers" :size="iconSize" />
          <span class="w-full truncate text-center text-xs" :title="icon.label">{{ icon.label }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import type { CharacterItem } from './types'

  const props = defineProps<{
    item: CharacterItem
    selectedCharacterKey: string
    selectedIconKey: string
    iconSize: number
    popupStyle: Record<string, string>
    theme?: string
  }>()

  const emit = defineEmits<{
    select: [iconKey: string]
    enter: []
    leave: []
  }>()

  const isSelected = (iconKey: string) =>
    props.selectedCharacterKey === props.item.key && props.selectedIconKey === iconKey
</script>
