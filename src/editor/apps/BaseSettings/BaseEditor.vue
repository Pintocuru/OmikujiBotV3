<!-- src/editor/apps/BaseSettings/BaseEditor.vue -->
<template>
  <!-- Key表示 -->
  <SettingItem
    v-if="category === 'placeholders'"
    icon="Pencil"
    labelKey="baseSettings.key.edit"
    descriptionKey="baseSettings.key.description"
  >
    <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 overflow-x-auto whitespace-nowrap">
        {{ key }}
      </div>
      <!-- 編集ボタン -->
      <KeyEditor :currentKey="key" :category="category" />
    </div>
  </SettingItem>

  <!-- 有効・無効の切り替えボタン -->
  <SettingItem
    icon="ToggleRight"
    v-if="showEnabledToggle"
    labelKey="baseSettings.isEnabled.label"
    descriptionKey="baseSettings.isEnabled.description"
  >
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
  </SettingItem>

  <!-- 名前 -->
  <SettingItem icon="Zap" labelKey="baseSettings.name.label" descriptionKey="baseSettings.name.description">
    <input type="text" v-model="name" class="input w-full" />
  </SettingItem>

  <!-- 説明 -->
  <SettingItem
    v-if="isDescription"
    icon="Info"
    labelKey="baseSettings.description.label"
    descriptionKey="baseSettings.description.description"
  >
    <input type="text" v-model="description" class="input w-full" />
  </SettingItem>

  <!-- タグ編集 -->
  <BaseTagEditor v-if="showTags" v-model="tags" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BaseRecordType } from '@/types/core'
  import { DataCategoryType } from '@/types/OmikujiData'
  import BaseTagEditor from './BaseTagEditor.vue'
  import KeyEditor from '@/editor/helpers/KeyEditor/KeyEditor.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const props = withDefaults(
    defineProps<{
      modelValue: BaseRecordType
      category: DataCategoryType | null
      showEnabledToggle?: boolean
      isDescription?: boolean
      showTags?: boolean
    }>(),
    {
      showEnabledToggle: true,
      isDescription: true,
      showTags: true,
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: BaseRecordType]
  }>()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof BaseRecordType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => emit('update:modelValue', { ...props.modelValue, [key]: value }),
    })

  const key = createComputed('key')
  const name = createComputed('name')
  const description = createComputed('description')
  const isEnabled = createComputed('isEnabled')
  const tags = createComputed('tags')
</script>
