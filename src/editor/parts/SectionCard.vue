<!-- src/editor/parts/SectionCard.vue -->
<template>
  <div
    v-show="isActive"
    :id="sectionKey ? `section-${sectionKey}` : undefined"
    class="card bg-base-200 max-w-5xl mx-auto"
  >
    <div class="flex items-center p-2 rounded-t-xl" :class="headerClass">
      <div class="card-title flex items-center gap-2 font-bold text-xl">
        <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />
        <span>{{ label }}</span>
      </div>
      <div v-if="description" class="ml-auto text-sm pr-2">{{ description }}</div>
    </div>

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
      sectionKey?: string
      variant?: DaisyUIColorType
    }>(),
    { variant: 'secondary' }
  )

  const { t } = useI18n()
  const isActive = useSectionActive(toRef(props, 'sectionKey'))

  const tr = (key?: string, fallback?: string) => (key ? t(key) : (fallback ?? ''))
  const label = computed(() => tr(props.labelKey, props.label))
  const description = computed(() => tr(props.descriptionKey, props.description))

  // safeList.css で safelist 済みの動的クラス
  const headerClass = computed(() => `bg-${props.variant} text-${props.variant}-content`)
  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
