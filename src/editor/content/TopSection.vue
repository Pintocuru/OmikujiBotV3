<!-- src/editor/content/TopSection.vue -->
<!-- TOPページの1区画。見出し(アイコン・名前・件数)を押すとそのカテゴリへ移動し、中身は slot に置く -->
<template>
  <section class="space-y-1">
    <button
      type="button"
      class="flex items-center gap-2 px-1 text-lg font-bold hover:text-primary transition-colors"
      @click="emit('select')"
    >
      <component :is="icon" class="w-4 h-4" />
      {{ label }}
      <span class="font-normal text-base-content/50">({{ t('topPage.count', { count }) }})</span>
    </button>

    <slot />
  </section>
</template>

<script setup lang="ts">
  import type { Component } from 'vue'
  import { useI18n } from 'vue-i18n'

  defineProps<{
    icon: Component
    label: string
    count: number
  }>()

  const emit = defineEmits<{ select: [] }>()

  const { t } = useI18n()
</script>
