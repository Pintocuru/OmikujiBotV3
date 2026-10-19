<!-- src/editor/assets/PostFlow/Message/MessageTextEditor.vue -->
<template>
  <div class="relative w-full">
    <!-- input -->
    <input
      v-model="model"
      type="text"
      class="input input-bordered input-sm w-full pr-10"
      :placeholder="placeholderText"
      :class="{ hidden: isTextarea }"
    />

    <!-- textarea -->
    <textarea
      v-model="model"
      :rows="rows"
      class="textarea textarea-bordered textarea-sm w-full pr-10"
      :placeholder="placeholderText"
      :class="{ hidden: !isTextarea }"
    ></textarea>

    <!-- toggle -->
    <button
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
      @click="isTextarea = !isTextarea"
    >
      <AlignLeft v-if="!isTextarea" class="w-4 h-4" />
      <AlignJustify v-else class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref } from 'vue'
  import { AlignLeft, AlignJustify } from 'lucide-vue-next'

  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      modelValue: string
      placeholder?: string
      rows?: number
    }>(),
    {
      rows: 3,
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const isTextarea = ref(true)

  const placeholderText = computed(() => props.placeholder ?? t('postFlow.messageEditor.placeholder'))

  const model = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => emit('update:modelValue', value),
  })
</script>
