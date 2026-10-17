<!-- src/editor/parts/SectionCard.vue -->
<template>
  <div class="transition-all bg-base-200">
    <div class="flex justify-between items-center p-2 rounded-t-xl" :class="headerClass">
      <div class="flex items-center gap-2 font-bold text-xl">
        <!-- アイコン -->
        <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />

        <!-- タイトル -->
        <span>{{ title ?? '' }}</span>
      </div>
      <div v-if="description" class="text-sm">{{ description }}</div>
    </div>
    <!-- 常にカードを表示 -->
    <div class="space-y-2 p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { DaisyUIExtendedColorType } from '@/types/core'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      title?: string
      icon?: LucideIconName
      description?: string
      variant?: DaisyUIExtendedColorType
      isOpen?: boolean
    }>(),
    {
      description: '',
      variant: 'secondary',
      isOpen: false,
    }
  )

  // 親コンポーネントに開閉の切り替えを通知
  defineEmits<{
    toggle: []
  }>()

  const headerClass = computed(() => `bg-${props.variant} text-${props.variant}-content`)

  // 文字列から lucide アイコンコンポーネントを取得
  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
