<!-- src/editor/parts/IconRadioGroup.vue -->
<template>
  <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="ariaLabel">
    <button
      v-if="allowEmpty"
      type="button"
      role="radio"
      :aria-checked="modelValue === ''"
      class="flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition cursor-pointer"
      :class="modelValue === '' ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
      @click="modelValue = ''"
    >
      <div class="flex items-center justify-center w-8 h-8">
        <component :is="resolveLucideIcon('Ban')" class="w-5 h-5" />
      </div>
      <span class="text-xs truncate max-w-20">{{ emptyLabel ?? t('common.none') }}</span>
    </button>

    <div v-for="key in keys" :key="key" class="tooltip" :data-tip="t(`${i18nPrefix}.${key}.description`)">
      <button
        type="button"
        role="radio"
        :aria-checked="modelValue === key"
        class="flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition cursor-pointer"
        :class="modelValue === key ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
        @click="modelValue = key"
      >
        <div class="flex items-center justify-center w-8 h-8">
          <component :is="resolveLucideIcon(icons[key])" class="w-5 h-5" />
        </div>
        <span class="text-xs truncate max-w-20">{{ t(`${i18nPrefix}.${key}.label`) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="K extends string">
  import { useI18n } from 'vue-i18n'
  import { resolveLucideIcon, type LucideIconName } from '@/common/LucideIcon/useLucideIcon'

  withDefaults(
    defineProps<{
      i18nPrefix: string /** i18n キー接頭辞。`<prefix>.<key>.label` / `.description` を参照する */
      icons: Record<K, LucideIconName> /** 言語非依存のアイコン定義 */
      keys: readonly K[]
      ariaLabel?: string
      allowEmpty?: boolean
      emptyLabel?: string /** 省略時は t('common.none') */
    }>(),
    { allowEmpty: false }
  )

  const { t } = useI18n()

  const modelValue = defineModel<K | ''>({ required: true })
</script>
