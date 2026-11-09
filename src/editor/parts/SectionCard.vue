<!-- src/editor/parts/SectionCard.vue -->
<template>
  <div
    v-show="isActive"
    :id="sectionKey ? `section-${sectionKey}` : undefined"
    class="card bg-base-200 max-w-5xl mx-auto"
  >
    <div class="flex items-center p-2 rounded-t-xl" :class="headerClass">
      <div class="card-title flex items-center gap-2 font-bold text-xl">
        <!-- アイコン -->
        <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />

        <!-- タイトル -->
        <span>{{ label }}</span>
      </div>
      <!-- 説明 -->
      <div v-if="description" class="ml-auto text-sm pr-2">{{ description }}</div>
    </div>

    <!-- カード本体 -->
    <div class="space-y-2 p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useSectionActive } from './composables/useSectionActive'
  import { DaisyUIColorType } from '@/types/core'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      label?: string
      labelKey?: string
      description?: string
      descriptionKey?: string
      icon: LucideIconName
      // SectionTabs のタブのキー。省略すると常に表示する
      sectionKey?: string
      variant?: DaisyUIColorType
    }>(),
    {
      variant: 'secondary',
    }
  )

  const { t } = useI18n()
  const isActive = useSectionActive(toRef(props, 'sectionKey'))

  const label = computed(() => (props.labelKey ? t(props.labelKey) : (props.label ?? '')))
  const description = computed(() => (props.descriptionKey ? t(props.descriptionKey) : (props.description ?? '')))

  // Tailwind は文字列を組み立てたクラス名を拾えないので、完全なクラス名で持つ
  const headerClassMap: Record<DaisyUIColorType, string> = {
    primary: 'bg-primary text-primary-content',
    secondary: 'bg-secondary text-secondary-content',
    accent: 'bg-accent text-accent-content',
    neutral: 'bg-neutral text-neutral-content',
    info: 'bg-info text-info-content',
    success: 'bg-success text-success-content',
    warning: 'bg-warning text-warning-content',
    error: 'bg-error text-error-content',
  }
  const headerClass = computed(() => headerClassMap[props.variant])
  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
