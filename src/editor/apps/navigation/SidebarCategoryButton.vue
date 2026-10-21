<!-- src/editor/apps/navigation/SidebarCategoryButton.vue -->
<!-- カテゴリボタン（データ系・設定系で共通） -->
<template>
  <button
    class="btn w-full relative flex items-center gap-2 min-h-0 h-auto py-2"
    :class="[
      isSelected ? 'bg-primary text-primary-content hover:bg-primary' : 'btn-ghost',
      isExpanded ? 'justify-start px-3' : 'justify-center px-0',
    ]"
    :title="`${t(`categories.${category}.label`)}：${t(`categories.${category}.description`)}`"
    @click="emit('click')"
  >
    <component :is="resolveLucideIcon(icon)" class="w-5 h-5 shrink-0" />
    <span v-if="isExpanded" class="text-sm truncate text-left flex-1">{{ t(`categories.${category}.label`) }}</span>
    <span
      v-if="count > 0"
      class="badge badge-xs badge-primary shrink-0"
      :class="isExpanded ? '' : 'absolute -top-1 -right-1'"
    >
      {{ count }}
    </span>
  </button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { CategoryType } from '@/types/OmikujiData/'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  defineProps<{
    category: CategoryType
    icon: LucideIconName
    count: number
    isSelected: boolean
    isExpanded: boolean
  }>()

  const emit = defineEmits<{ click: [] }>()

  const { t } = useI18n()
</script>
