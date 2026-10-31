<!-- src/editor/parts/NoParamsCard.vue -->
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
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      message?: string
      messageKey?: string
      sub?: string
      subKey?: string
      iconName?: LucideIconName
    }>(),
    {
      iconName: 'Package',
    }
  )

  const { t } = useI18n()

  const message = computed(() => (props.messageKey ? t(props.messageKey) : (props.message ?? '')))
  const sub = computed(() => (props.subKey ? t(props.subKey) : (props.sub ?? '')))

  const icon = resolveLucideIcon(props.iconName)
</script>
