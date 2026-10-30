<template>
  <div
    class="p-2 rounded-md shadow-lg bg-base-300 text-base-content"
    :class="[isVertical ? 'flex flex-col gap-1' : 'flex items-center gap-4']"
  >
    <div
      class="flex flex-col gap-1 rounded-md p-1"
      :class="[
        isVertical ? 'min-w-0' : 'min-w-0 w-1/3 sm:w-1/4 shrink-0',
        variant ? `bg-${props.variant} text-${props.variant}-content` : '',
      ]"
    >
      <label class="label-text font-bold flex items-center gap-2">
        <!-- アイコン -->
        <component v-if="IconComponent" :is="IconComponent" class="w-5 h-5" />

        <span>{{ label }}</span>

        <AlertTriangle
          v-if="showWarning"
          class="w-4 h-4 text-error"
          :title="t('appInfoEditor.settings.common.warning')"
        />

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
      </label>

      <span v-if="description" class="text-xs line-clamp-3 wrap-break-word" :title="description">
        {{ description }}
      </span>
    </div>

    <div class="flex-1 min-w-0">
      <slot />
    </div>

    <button
      v-if="showReset"
      class="btn btn-ghost btn-xs"
      @click="$emit('reset')"
      :title="t('appInfoEditor.settings.common.reset')"
    >
      <RotateCcw class="w-3 h-3" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { DaisyUIColorType } from '@/types/core'
  import { RotateCcw, AlertTriangle, Info } from 'lucide-vue-next'
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
    {
      showReset: false,
      layout: 'horizontal',
    }
  )

  defineEmits<{ reset: [] }>()

  const { t } = useI18n()

  const label = computed(() => (props.labelKey ? t(props.labelKey) : (props.label ?? '')))
  const description = computed(() => (props.descriptionKey ? t(props.descriptionKey) : (props.description ?? '')))

  const isVertical = computed(() => props.layout === 'vertical')

  // 文字列から lucide アイコンコンポーネントを取得
  const IconComponent = computed(() => (props.icon ? resolveLucideIcon(props.icon) : undefined))
</script>
