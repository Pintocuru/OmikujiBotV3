<!-- src/editor/assets/characters/color/CharacterColorSettings.vue -->
<template>
  <!-- プレビュー -->
  <div class="relative flex justify-center">
    <CommentBubblePreview :botName="botName" :color="currentColor" bubbleMotionEnter="none" />
  </div>

  <!-- フキダシカラー設定 -->
  <SubSectionHeader icon="Palette" title="カラー設定" description="フキダシの配色やテーマカラーを設定します" />
  <ColorPicker :model-value="currentColor" @update:model-value="handleColorUpdate" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/'
  import CommentBubblePreview from '@/ui/CommentBubble/editor/CommentBubblePreview.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'

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
