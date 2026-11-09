<!-- src/layout/_shared/LayoutPosition.vue -->
<template>
  <div class="flex h-full w-full items-center" :class="alignmentClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      position?: 'left' | 'center' | 'right'
    }>(),
    { position: 'center' }
  )

  const alignmentClass = computed(() => ({
    'justify-start': props.position === 'left',
    'justify-center': props.position === 'center',
    'justify-end': props.position === 'right'
  }))
</script>
