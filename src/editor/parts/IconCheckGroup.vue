<!-- src/editor/parts/IconCheckGroup.vue -->
<template>
  <div class="flex flex-wrap gap-2" role="group" :aria-label="ariaLabel">
    <div v-for="key in keys" :key="key" class="tooltip" :data-tip="t(`${i18nPrefix}.${key}.description`)">
      <button
        type="button"
        role="checkbox"
        :aria-checked="modelValue.includes(key)"
        class="flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition cursor-pointer"
        :class="modelValue.includes(key) ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
        @click="toggle(key)"
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

  defineProps<{
    i18nPrefix: string
    icons: Record<K, LucideIconName>
    keys: readonly K[]
    ariaLabel?: string
  }>()

  const { t } = useI18n()
  const modelValue = defineModel<K[]>({ required: true })

  const toggle = (key: K) => {
    modelValue.value = modelValue.value.includes(key)
      ? modelValue.value.filter((k) => k !== key)
      : [...modelValue.value, key]
  }
</script>
