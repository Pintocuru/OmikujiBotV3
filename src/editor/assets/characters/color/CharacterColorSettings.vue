<!-- src/editor/assets/characters/color/CharacterColorSettings.vue -->
<template>
  <!-- プレビュー -->
  <div class="relative flex justify-center pb-2">
    <BubbleItem :botName="botName" :message="PREVIEW_MESSAGE" :color="currentColor" />
  </div>

  <ColorPicker :model-value="currentColor" @update:model-value="handleColorUpdate" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/'
  import BubbleItem from './BubbleItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'

  const PREVIEW_MESSAGE = 'これはプレビュー表示です。文字の見やすさを確認してください。'

  const props = defineProps<{
    modelValue?: CharacterColorType
    botName: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  // 現在の色設定を取得
  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))

  // ColorModeSelectorからの更新をemitで親へ通知
  const handleColorUpdate = (newColor: CharacterColorType) => {
    emit('update:modelValue', newColor)
  }
</script>
