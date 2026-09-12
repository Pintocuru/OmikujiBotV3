<!-- shared/components/parts/InformationCard.vue -->
<template>
  <div class="alert w-full" :class="headerClass">
    <component :is="resolvedIcon" class="w-6 h-6" />
    <div class="space-y-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import {
    Info,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Sparkles,
    CircleDot,
    Star,
    Shield,
    Layers,
    Square,
    LayoutGrid,
  } from 'lucide-vue-next'
  import { DaisyUIExtendedColorType } from '@/types/core'

  const props = defineProps<{
    variant?: DaisyUIExtendedColorType
    icon?: DaisyUIExtendedColorType
  }>()

  const VARIANT_CLASS: Record<DaisyUIExtendedColorType, string> = {
    info: 'alert-info text-info-content',
    success: 'alert-success text-success-content',
    warning: 'alert-warning text-warning-content',
    error: 'alert-error text-error-content',

    // 存在しないのはbgを使う
    primary: 'bg-primary text-primary-content',
    secondary: ' bg-secondary text-secondary-content',
    accent: ' bg-accent text-accent-content',
    neutral: 'bg-neutral text-neutral-content',
    'base-100': 'bg-base-100 text-base-content',
    'base-200': 'bg-base-200 text-base-content',
    'base-300': 'bg-base-300 text-base-content',
  }

  const VARIANT_ICON: Record<DaisyUIExtendedColorType, any> = {
    primary: Sparkles, // 強調・目立たせたい
    secondary: CircleDot, // 補助的
    accent: Star, // 特別感
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    neutral: Shield, // 中立・保護
    'base-100': Square,
    'base-200': Layers,
    'base-300': LayoutGrid,
  }

  const headerClass = computed(() => VARIANT_CLASS[props.variant ?? 'info'])

  const resolvedIcon = computed(() => VARIANT_ICON[props.icon ?? props.variant ?? 'info'])
</script>
