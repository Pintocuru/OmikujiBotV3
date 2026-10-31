<!-- src/editor/assets/mikuji/item/OmikujiItemControlSettings.vue -->
<template>
  <!-- 評価ブロック {{ }} -->
  <SettingItem icon="ListChecks" labelKey="omikujiItem.control.label" descriptionKey="omikujiItem.control.description">
    <MessageTextDialog :modelValue="item.variable" :isCommentMode="true" @update:modelValue="updateVariable" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { OmikujiItemControlType } from '@/types/OmikujiData/'

  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from '@/editor/assets/ScenarioStep/Message/MessageTextDialog.vue'

  const props = defineProps<{
    item: OmikujiItemControlType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemControlType]
  }>()

  const updateVariable = (variable: string) => emit('update', { ...props.item, variable })
</script>
