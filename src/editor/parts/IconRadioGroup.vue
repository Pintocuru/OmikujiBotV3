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
      <span class="text-xs truncate max-w-20">{{ emptyLabel }}</span>
    </button>

    <div v-for="key in keys" :key="key" class="tooltip" :data-tip="map[key].description">
      <button
        type="button"
        role="radio"
        :aria-checked="modelValue === key"
        class="flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition cursor-pointer"
        :class="modelValue === key ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
        @click="modelValue = key"
      >
        <div class="flex items-center justify-center w-8 h-8">
          <component :is="resolveLucideIcon(map[key].icon)" class="w-5 h-5" />
        </div>
        <span class="text-xs truncate max-w-20">
          {{ map[key].label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="K extends string">
  import { DisplayMetaLucide } from '@/common/LucideIcon/DisplayMetaLucide'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  withDefaults(
    defineProps<{
      map: Record<K, DisplayMetaLucide>
      keys: readonly K[]
      ariaLabel?: string
      allowEmpty?: boolean
      emptyLabel?: string
    }>(),
    { allowEmpty: false, emptyLabel: 'なし' }
  )

  const modelValue = defineModel<K | ''>({ required: true })
</script>
