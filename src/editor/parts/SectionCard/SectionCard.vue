<!-- shared/components/parts/SectionCard.vue -->
<template>
  <div class="collapse collapse-arrow transition-all bg-base-200">
    <!-- 親から制御される開閉状態 -->
    <input type="checkbox" :checked="isOpen" @change="$emit('toggle')" />
    <div class="collapse-title flex justify-between items-center" :class="headerClass">
      <div class="flex items-center gap-2 font-bold text-xl">
        <!-- アイコン -->
        <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />

        <!-- タイトル -->
        <span>{{ title ?? '' }}</span>
      </div>
      <div v-if="description" class="text-sm">{{ description }}</div>
    </div>
    <!-- Open: カードを表示 -->
    <div class="collapse-content space-y-2" :class="{ 'p-4': isOpen }">
      <slot />
    </div>

    <!-- Close: サマリー表示 -->
    <div v-if="!isOpen" class="text-sm opacity-80">
      <slot name="summary" />
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
