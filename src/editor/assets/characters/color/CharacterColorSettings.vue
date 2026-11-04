<!-- src/editor/assets/characters/color/CharacterColorSettings.vue -->
<template>
  <!-- プレビュー -->
  <div class="flex justify-center pb-4">
    <div
      class="w-full max-w-md rounded-lg border-l-4 px-4 py-3 shadow-sm"
      :style="{
        backgroundColor: currentColor.background,
        borderLeftColor: currentColor.accent,
      }"
    >
      <!-- キャラクター名 -->
      <div
        class="mb-2 w-fit border-b-2 pb-1 text-sm font-bold"
        :style="{
          color: currentColor.name,
          borderColor: currentColor.accent,
        }"
      >
        {{ botName ?? 'サンプルキャラクター' }}
      </div>

      <!-- メッセージ -->
      <p class="text-sm" :style="{ color: currentColor.text }">こんにちは！色の見え方はこんな感じです。</p>
    </div>
  </div>

  <!-- 色設定 -->
  <ColorPicker :model-value="currentColor" @update:model-value="emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorScheme, type CharacterColorType } from '@/types/OmikujiData'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'

  const props = defineProps<{
    modelValue?: CharacterColorType
    botName?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))
</script>
