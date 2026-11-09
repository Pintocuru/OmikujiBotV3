<!-- src/editor/parts/IconRadioGroup.vue -->
<template>
  <div class="flex gap-1" :class="compact ? '' : 'flex-wrap'" role="radiogroup" :aria-label="ariaLabel">
    <button
      v-if="allowEmpty"
      type="button"
      role="radio"
      :aria-checked="modelValue === ''"
      class="flex flex-col items-center rounded-lg transition cursor-pointer"
      :class="compact ? 'flex-1 min-w-0 p-1 gap-1' : 'p-1 gap-1'"
      :style="compact ? { flex: '0 0 auto' } : undefined"
      :aria-label="emptyLabel ?? t('common.none')"
      @click="modelValue = ''"
    >
      <div class="flex items-center justify-center w-8 h-8">
        <component :is="resolveLucideIcon('Ban')" class="w-5 h-5" />
      </div>
      <span v-if="!compact" class="text-xs truncate max-w-20">{{ emptyLabel ?? t('common.none') }}</span>
    </button>

    <div
      v-for="key in keys"
      :key="key"
      class="tooltip"
      :class="compact ? 'flex-1 min-w-0' : ''"
      :data-tip="t(`${i18nPrefix}.${key}.description`)"
    >
      <button
        type="button"
        role="radio"
        :aria-checked="modelValue === key"
        class="flex flex-col items-center rounded-lg transition cursor-pointer w-full"
        :class="[
          compact ? 'p-1 gap-1' : 'p-1 gap-1',
          modelValue === key ? 'bg-primary text-primary-content' : 'border-2 border-base-300 hover:border-primary',
        ]"
        :aria-label="t(`${i18nPrefix}.${key}.label`)"
        @click="modelValue = key"
      >
        <div class="flex items-center justify-center w-8 h-8">
          <component :is="resolveLucideIcon(icons[key])" class="w-5 h-5" />
        </div>
        <span v-if="!compact" class="text-xs truncate max-w-20">{{ t(`${i18nPrefix}.${key}.label`) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="K extends string">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { resolveLucideIcon, type LucideIconName } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      i18nPrefix: string /** i18n キー接頭辞。`<prefix>.<key>.label` / `.description` を参照する */
      icons: Record<K, LucideIconName> /** 言語非依存のアイコン定義 */
      keys: readonly K[]
      ariaLabel?: string
      allowEmpty?: boolean
      emptyLabel?: string /** 省略時は t('common.none') */
      compactThreshold?: number /** この数(表示ボタン総数)を超えたら compact モード。省略時 6 */
    }>(),
    { allowEmpty: false, compactThreshold: 8 }
  )

  const { t } = useI18n()

  const modelValue = defineModel<K | ''>({ required: true })

  /** compact モード: ラベル非表示・余白縮小で 1 行に収めやすくする */
  const compact = computed(() => props.keys.length + (props.allowEmpty ? 1 : 0) > props.compactThreshold)
</script>
