<!-- src/editor/helpers/ThemeColorPicker/LegacyColorPicker.vue -->
<!-- TODO:ファイル名を変える -->
<template>
  <div class="bg-base-300 p-4 flex flex-col space-y-4">
    <!-- プリセットカラー -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="(theme, i) in DEFAULT_COLOR_THEMES"
        :key="i"
        class="w-8 h-8 rounded-full border border-base-content/20 hover:scale-110 transition"
        :style="{ background: theme.background }"
        :title="`プリセット ${i + 1}`"
        @click="selectPreset(theme)"
      />
    </div>

    <!-- カラーピッカー -->
    <div class="flex flex-wrap gap-4">
      <div v-for="{ label, key } in colorFields" :key="key" class="form-control flex-1 min-w-32">
        <label class="label">
          <span class="label-text">{{ label }}</span>
        </label>

        <input
          type="color"
          class="input input-bordered h-12 w-full"
          :value="modelValue[key]"
          @input="onUpdate(key, ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CharacterColorType } from '@/types/OmikujiData/'
  import { DEFAULT_COLOR_THEMES } from './CharacterColorPreset'

  const props = defineProps<{
    modelValue: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  const colorFields = [
    { label: '名前の色', key: 'name' },
    { label: 'テキストの色', key: 'text' },
    { label: '背景色', key: 'background' },
    { label: 'アクセント', key: 'accent' },
  ] as const

  const onUpdate = (key: keyof CharacterColorType, value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [key]: value,
    })
  }

  const selectPreset = (theme: Partial<CharacterColorType>) => {
    if (!theme.name || !theme.text || !theme.background || !theme.accent) return

    emit('update:modelValue', {
      ...props.modelValue,
      name: theme.name,
      text: theme.text,
      background: theme.background,
      accent: theme.accent,
    })
  }
</script>
