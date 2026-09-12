<!-- shared/components/parts/NoParamsCard.vue -->
<template>
  <div class="card bg-base-200 p-4 flex flex-col items-center justify-center space-y-2">
    <component :is="icon" class="w-8 h-8 text-base-content/60" />
    <div class="text-base text-base-content/70 text-center">
      {{ message }}
    </div>
    <div v-if="sub" class="text-sm text-base-content/50 text-center">
      {{ sub }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { resolveLucideIcon, type LucideIconName } from '../../utils/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      message: string
      sub?: string
      iconName?: LucideIconName
    }>(),
    {
      iconName: 'Package',
    }
  )

  const icon = resolveLucideIcon(props.iconName)
</script>
