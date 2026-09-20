<!-- src/editor/assets/characters/color/CharacterColorSettings.vue -->
<template>
  <!-- プレビュー -->
  <div class="relative flex justify-center">
    <CommentBubblePreview :botName="botName" :color="currentColor" bubbleMotionEnter="none" />
  </div>

  <!-- フキダシカラー設定 -->
  <SubSectionHeader icon="Palette" title="カラー設定" description="フキダシの配色やテーマカラーを設定します" />
  <LegacyColorPicker :model-value="modelValue" @update:model-value="handleColorUpdate" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/'
  import CommentBubblePreview from '@/editor/UiEditor/CommentBubble/CommentBubblePreview.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import LegacyColorPicker from './LegacyColorPicker.vue'

  const props = defineProps<{
    modelValue?: CharacterColorType
    botName: string
  }>()

  defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  // Pinia store
  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // 現在の色設定を取得
  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))

  // ColorModeSelectorからの更新を受け取る
  // TODO:ここで更新せず、emitsをつかうこと。
  const handleColorUpdate = (newColor: CharacterColorType) => {
    if (!selectedItemKey.value) return
    updateRecordProperty('characters', selectedItemKey.value, 'color', newColor)
  }
</script>
