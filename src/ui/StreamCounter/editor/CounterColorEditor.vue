<!-- src/ui/StreamCounter/editor/CounterColorEditor.vue -->
<template>
  <SettingItem labelKey="uiSettings.common.color.label" descriptionKey="uiSettings.common.color.description" layout="vertical">
    <div class="flex flex-col gap-3">
      <div v-for="(color, index) in colors" :key="index" class="flex items-start gap-2">
        <span class="badge badge-neutral mt-4">{{ index + 1 }}</span>
        <div class="flex-1">
          <ColorPicker :modelValue="color" @update:modelValue="(val) => updateAt(index, val)" />
        </div>
        <button
          class="btn btn-ghost btn-sm mt-3"
          :disabled="colors.length <= 1"
          :title="t('uiSettings.streamCounter.color.remove')"
          @click="removeAt(index)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>

      <button class="btn btn-outline btn-sm self-start" :disabled="colors.length >= maxColors" @click="add">
        <Plus class="h-4 w-4" />
        {{ t('uiSettings.streamCounter.color.add') }}
      </button>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Plus, Trash2 } from 'lucide-vue-next'
  import { CharacterColorSchema, type CharacterColorType } from '@/types/OmikujiData/'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'

  const props = defineProps<{
    colors: CharacterColorType[]
  }>()

  const emit = defineEmits<{
    'update:colors': [value: CharacterColorType[]]
  }>()

  const { t } = useI18n()

  const maxColors = 8

  const updateAt = (index: number, value: CharacterColorType) =>
    emit(
      'update:colors',
      props.colors.map((c, i) => (i === index ? value : c))
    )

  const removeAt = (index: number) =>
    emit(
      'update:colors',
      props.colors.filter((_, i) => i !== index)
    )

  // 追加する色は、最後の色をコピーする
  const add = () => emit('update:colors', [...props.colors, { ...(props.colors.at(-1) ?? CharacterColorSchema.parse({})) }])
</script>
