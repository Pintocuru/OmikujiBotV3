<!-- src/editor/parts/SubSectionHeader.vue -->
<template>
  <div class="flex items-center justify-between border-b pb-1">
    <!-- 左側：アイコン + タイトル + 説明 -->
    <h3 class="card-title text-xl flex items-center gap-2">
      <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />
      <span>{{ title }}</span>
      <span v-if="description" class="text-base font-normal">
        {{ description }}
      </span>
    </h3>

    <!-- 右側：追加コンテンツ用スロット -->
    <div class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = defineProps<{
    icon: LucideIconName
    title: string
    description?: string
  }>()

  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
