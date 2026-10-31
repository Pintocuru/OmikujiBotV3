<!-- src/editor/parts/SectionCard.vue -->
<template>
  <!-- sectionKey があるときは、ContentArea のタブで選択中のものだけ表示する -->
  <div v-show="isActive" :id="sectionKey ? `section-${sectionKey}` : undefined" class="transition-all bg-base-200">
    <div class="flex justify-between items-center p-2 rounded-t-xl" :class="headerClass">
      <div class="flex items-center gap-2 font-bold text-xl">
        <!-- アイコン -->
        <component :is="IconComponent" v-if="IconComponent" class="w-6 h-6" />

        <!-- タイトル -->
        <span>{{ label }}</span>
      </div>
      <div v-if="description" class="text-sm pr-2">{{ description }}</div>
    </div>

    <!-- カード本体 -->
    <div class="space-y-2 p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { DaisyUIColorType } from '@/types/core'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      label?: string
      labelKey?: string
      description?: string
      descriptionKey?: string
      icon: LucideIconName
      // ContentArea のタブのキー。省略すると常に表示する
      sectionKey?: string
      variant?: DaisyUIColorType
    }>(),
    {
      variant: 'secondary',
    }
  )

  const { t } = useI18n()
  const { activeSection } = storeToRefs(useNavigationStore())
  const isActive = computed(() => !props.sectionKey || activeSection.value === props.sectionKey)

  const label = computed(() => (props.labelKey ? t(props.labelKey) : (props.label ?? '')))
  const description = computed(() => (props.descriptionKey ? t(props.descriptionKey) : (props.description ?? '')))

  const headerClass = computed(() => `bg-${props.variant} text-${props.variant}-content`)
  const IconComponent = computed(() => resolveLucideIcon(props.icon))
</script>
