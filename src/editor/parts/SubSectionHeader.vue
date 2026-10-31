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
  import { useI18n } from 'vue-i18n'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = defineProps<{
    icon: LucideIconName
    titleKey?: string
    descriptionKey?: string
    title?: string
    description?: string
  }>()

  const { t } = useI18n()

  const title = computed(() => (props.titleKey ? t(props.titleKey) : (props.title ?? '')))
  const description = computed(() => (props.descriptionKey ? t(props.descriptionKey) : (props.description ?? '')))

  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
