<!-- src/editor/parts/SectionCard.vue -->
<template>
  <div class="transition-all bg-base-200">
    <div class="flex justify-between items-center p-2 rounded-t-xl" :class="headerClass">
      <div class="flex items-center gap-2 font-bold text-xl">
        <!-- アイコン -->
        <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />

        <!-- タイトル -->
        <span>{{ t(props.labelKey) }}</span>
      </div>
      <div v-if="props.descriptionKey" class="text-sm pr-2">{{ t(props.descriptionKey) }}</div>
    </div>
    <!-- カード本体 -->
    <div class="space-y-2 p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { DaisyUIColorType } from '@/types/core'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      labelKey: string
      descriptionKey: string
      icon: LucideIconName
      variant?: DaisyUIColorType
    }>(),
    {
      variant: 'secondary',
    }
  )

  const { t } = useI18n()

  const headerClass = computed(() => `bg-${props.variant} text-${props.variant}-content`)
  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
