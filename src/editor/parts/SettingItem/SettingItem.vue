<!-- src/editor/parts/SettingItem/SettingItem.vue -->
<template>
  <div
    class="flex items-center gap-4 px-4 py-2 rounded-md shadow-lg bg-base-300 text-base-content"
    :class="headerClass"
  >
    <div class="flex flex-col gap-1 min-w-1/3 sm:min-w-1/4">
      <label class="label-text font-bold flex items-center gap-1">
        {{ label }}

        <AlertTriangle v-if="showWarning" class="w-4 h-4 text-error" title="注意が必要な設定です" />

        <slot name="label-extra" />
      </label>
      <span v-if="description" class="text-xs">{{ description }}</span>
    </div>
    <div class="flex-1">
      <slot />
    </div>
    <button v-if="showReset" class="btn btn-ghost btn-xs" @click="$emit('reset')" title="デフォルト値に戻す">
      <RotateCcw class="w-3 h-3" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { DaisyUIColorType } from '@/types/core'
  import { RotateCcw, AlertTriangle } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      label: string
      description?: string
      variant?: DaisyUIColorType | null
      showReset?: boolean
      showWarning?: boolean
    }>(),
    {
      showReset: false,
    }
  )

  defineEmits<{ reset: [] }>()

  const headerClass = computed(() => {
    return props.variant ? `border border-3 border-${props.variant}` : ''
  })
</script>
