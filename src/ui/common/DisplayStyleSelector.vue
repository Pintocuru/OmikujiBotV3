<!-- src/ui/common/DisplayStyleSelector.vue -->
<template>
  <SettingItem
    v-if="Object.keys(options).length > 1"
    labelKey="uiSettings.common.displayStyle.label"
    descriptionKey="uiSettings.common.displayStyle.description"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(config, key) in options"
        :key="key"
        class="badge cursor-pointer"
        :class="modelValue === key ? 'badge-primary' : 'badge-outline'"
        @click="select(key)"
      >
        {{ config?.label }}
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@/editor/parts/SettingItem.vue'

  type BaseComponentConfig = {
    label: string
  }

  defineProps<{
    modelValue: string
    options: Record<string, BaseComponentConfig>
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  function select(key: string) {
    emit('update:modelValue', key)
  }
</script>
