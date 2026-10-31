<!-- src/editor/apps/BaseSettings/BaseEditor.vue -->
<template>
  <!-- Key表示 -->
  <SettingItem
    v-if="isAssetCategory(category)"
    icon="Pencil"
    labelKey="baseSettings.key.label"
    descriptionKey="baseSettings.key.description"
  >
    <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 overflow-x-auto whitespace-nowrap">
        {{ key }}
      </div>
      <!-- 編集ボタン -->
      <KeyEditor v-if="category" :currentKey="key" :category="category" />
    </div>
  </SettingItem>

  <!-- 有効・無効の切り替えボタン -->
  <SettingItem
    icon="ToggleRight"
    v-if="isIsEnabled"
    labelKey="baseSettings.isEnabled.label"
    descriptionKey="baseSettings.isEnabled.description"
  >
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
  </SettingItem>

  <!-- イベント名 -->
  <SettingItem icon="Zap" labelKey="baseSettings.eventName.label" descriptionKey="baseSettings.eventName.description">
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
  <BaseTagEditor v-model="tags" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BaseRecordType } from '@/types/core'
  import { DataCategoryType } from '@/types/OmikujiData'
  import BaseTagEditor from './BaseTagEditor.vue'
  import KeyEditor from '@/editor/helpers/KeyEditor/KeyEditor.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const props = withDefaults(
    defineProps<{
      modelValue: BaseRecordType
      category: DataCategoryType | null
      isIsEnabled?: boolean
      isDescription?: boolean
    }>(),
    {
      isIsEnabled: true,
      isDescription: true,
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: BaseRecordType]
  }>()

  const { isAssetCategory } = useGetAssetData()

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
