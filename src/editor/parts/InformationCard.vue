<!-- src/editor/parts/InformationCard.vue -->
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
    type LucideIcon,
  } from 'lucide-vue-next'
  import { DaisyUIColorType } from '@/types/core'

  const props = defineProps<{
    variant?: DaisyUIColorType
    icon?: DaisyUIColorType
  }>()

  const VARIANT_CLASS: Record<DaisyUIColorType, string> = {
    info: 'alert-info text-info-content',
    success: 'alert-success text-success-content',
    warning: 'alert-warning text-warning-content',
    error: 'alert-error text-error-content',

    // 存在しないのはbgを使う
    primary: 'bg-primary text-primary-content',
    secondary: ' bg-secondary text-secondary-content',
    accent: ' bg-accent text-accent-content',
    neutral: 'bg-neutral text-neutral-content',
  }

  const VARIANT_ICON: Record<DaisyUIColorType, LucideIcon> = {
    primary: Sparkles, // 強調・目立たせたい
    secondary: CircleDot, // 補助的
    accent: Star, // 特別感
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    neutral: Shield, // 中立・保護
  }

  const headerClass = computed(() => VARIANT_CLASS[props.variant ?? 'info'])

  const resolvedIcon = computed(() => VARIANT_ICON[props.icon ?? props.variant ?? 'info'])
</script>
