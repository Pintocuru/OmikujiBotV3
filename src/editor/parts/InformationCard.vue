<!-- src/editor/parts/InformationCard.vue -->
<template>
  <div class="alert w-full" :class="VARIANT[variant]">
    <component :is="resolvedIcon" class="w-6 h-6" />
    <div class="space-y-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { DaisyUIColorType } from '@/types/core'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  type AlertVariant = Extract<DaisyUIColorType, 'info' | 'success' | 'warning' | 'error'>

  const { variant = 'info', icon = 'Info' } = defineProps<{ variant?: AlertVariant; icon?: LucideIconName }>()

  // アイコン名文字列 → Lucideコンポーネントに解決
  const resolvedIcon = computed(() => resolveLucideIcon(icon))

  // alert-* は safelist 対象外なので、完全なクラス名で持つ
  const VARIANT: Record<AlertVariant, string> = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  }
</script>
