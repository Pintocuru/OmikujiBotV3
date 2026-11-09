<!-- src/editor/parts/SubSectionHeader.vue -->
<template>
  <div class="flex items-center border-b pb-1" :class="borderClass">
    <!-- 左側：アイコン + タイトル + 説明 -->
    <div class="flex items-center gap-2 font-bold text-xl">
      <!-- アイコン -->
      <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />
      <!-- タイトル -->
      <span>{{ title }}</span>
      <!-- タイトルの隣(説明ボタンなど) -->
      <slot name="title-extra" />
    </div>

    <!-- 説明 -->
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
  import type { DaisyUIColorType } from '@/types/core'

  const props = defineProps<{
    icon: LucideIconName
    titleKey?: string
    descriptionKey?: string
    title?: string
    description?: string
    // 下線の色(省略すると標準)
    variant?: DaisyUIColorType
  }>()

  const { t } = useI18n()

  const title = computed(() => (props.titleKey ? t(props.titleKey) : (props.title ?? '')))
  const description = computed(() => (props.descriptionKey ? t(props.descriptionKey) : (props.description ?? '')))

  const IconComponent = computed(() => resolveLucideIcon(props.icon))

  // Tailwind は文字列を組み立てたクラス名を拾えないので、完全なクラス名で持つ
  const borderClassMap: Record<DaisyUIColorType, string> = {
    primary: 'border-b-2 border-primary',
    secondary: 'border-b-2 border-secondary',
    accent: 'border-b-2 border-accent',
    neutral: 'border-b-2 border-neutral',
    info: 'border-b-2 border-info',
    success: 'border-b-2 border-success',
    warning: 'border-b-2 border-warning',
    error: 'border-b-2 border-error',
  }
  const borderClass = computed(() => (props.variant ? borderClassMap[props.variant] : ''))
</script>
