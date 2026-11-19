<!-- src/editor/parts/SettingItem.vue -->
<template>
  <div
    class="p-2 rounded-md shadow-lg bg-base-300 text-base-content"
    :class="isVertical ? 'flex flex-col gap-1' : 'flex items-center gap-4'"
  >
    <div
      class="flex flex-col gap-1 rounded-md p-1 min-w-0"
      :class="[!isVertical && 'w-1/3 sm:w-1/4 shrink-0', variantClass]"
    >
      <div class="label-text font-bold flex items-center gap-2">
        <component :is="IconComponent" v-if="IconComponent" class="w-5 h-5" />

        <span>{{ label }}</span>

        <span v-if="showWarning" :title="t('appInfoEditor.settings.common.warning')">
          <AlertTriangle class="w-4 h-4 text-error" />
        </span>

        <!-- チートシート等のヘルプリンク -->
        <a
          v-if="helpUrl"
          :href="helpUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="link link-hover inline-flex items-center gap-0.5 text-info"
          :title="helpLabel ?? t('appInfoEditor.settings.common.help')"
        >
          <Info class="w-4 h-4" />
          <span v-if="helpLabel" class="text-xs">{{ helpLabel }}</span>
        </a>

        <slot name="label-extra" />
      </div>

      <span v-if="description" class="text-xs line-clamp-3 wrap-break-word" :title="description">
        {{ description }}
      </span>
    </div>

    <div class="flex-1 min-w-0">
      <slot />
    </div>

    <div v-if="showReset" class="tooltip tooltip-top" :data-tip="t('appInfoEditor.settings.common.reset')">
      <button
        type="button"
        class="btn btn-ghost btn-xs btn-square"
        :aria-label="t('appInfoEditor.settings.common.reset')"
        @click="$emit('reset')"
      >
        <RotateCcw class="w-3 h-3" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { DaisyUIColorType } from '@/types/core'
  import { RotateCcw, AlertTriangle, Info } from '@lucide/vue'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      // i18n 用
      labelKey?: string
      descriptionKey?: string
      // 開発用
      label?: string
      description?: string
      // オプション
      variant?: DaisyUIColorType | null
      icon?: LucideIconName
      showReset?: boolean
      showWarning?: boolean
      layout?: 'horizontal' | 'vertical'
      helpUrl?: string
      helpLabel?: string
    }>(),
    { showReset: false, layout: 'horizontal' }
  )

  defineEmits<{ reset: [] }>()

  const { t } = useI18n()

  const tr = (key?: string, fallback?: string) => (key ? t(key) : (fallback ?? ''))
  const label = computed(() => tr(props.labelKey, props.label))
  const description = computed(() => tr(props.descriptionKey, props.description))

  const isVertical = computed(() => props.layout === 'vertical')

  // safeList.css で safelist 済みの動的クラス
  const variantClass = computed(() => (props.variant ? `bg-${props.variant} text-${props.variant}-content` : ''))

  // 文字列から lucide アイコンコンポーネントを取得
  const IconComponent = computed(() => (props.icon ? resolveLucideIcon(props.icon) : undefined))
</script>
