<!-- src/editor/parts/SubSectionHeader.vue -->
<template>
  <div class="flex items-center border-b pb-1">
    <div class="flex items-center gap-2 font-bold text-xl">
      <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />
      <span>{{ title }}</span>
      <!-- タイトルの隣(説明ボタンなど) -->
      <slot name="title-extra" />
    </div>

    <div v-if="description" class="ml-auto mr-2 text-sm text-base-content/60">
      {{ description }}
    </div>

    <!-- 右側：追加コンテンツ用スロット -->
    <div class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = defineProps<{
    icon: LucideIconName
    titleKey?: string
    descriptionKey?: string
    title?: string
    description?: string
  }>()

  const { t } = useI18n()

  const tr = (key?: string, fallback?: string) => (key ? t(key) : (fallback ?? ''))
  const title = computed(() => tr(props.titleKey, props.title))
  const description = computed(() => tr(props.descriptionKey, props.description))
  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
