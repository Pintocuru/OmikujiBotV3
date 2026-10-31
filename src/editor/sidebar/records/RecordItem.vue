<!-- src/editor/sidebar/records/RecordItem.vue -->
<template>
  <div
    class="group flex items-center gap-1 pl-4 pr-1 rounded hover:bg-neutral-content hover:text-neutral cursor-pointer"
    :class="isSelected ? `bg-neutral text-neutral-content` : ''"
    @click="emit('select')"
  >
    <GripVertical v-if="draggable" class="drag-handle w-3 h-3 shrink-0 opacity-0 group-hover:opacity-30 cursor-grab" />
    <EyeOff v-if="isEnabled === false" class="w-3 h-3 shrink-0 opacity-40" />
    <span
      class="text-sm py-1 truncate flex-1 min-w-0 select-none"
      :class="[!isSelected ? 'opacity-70' : '', isEnabled === false ? 'line-through' : '']"
    >
      {{ label }}
    </span>
    <slot name="menu" />
  </div>
</template>

<script setup lang="ts">
  import { GripVertical, EyeOff } from 'lucide-vue-next'

  defineProps<{
    label: string
    isEnabled?: boolean
    draggable?: boolean
    isSelected: boolean
  }>()

  const emit = defineEmits<{
    select: []
  }>()
</script>
