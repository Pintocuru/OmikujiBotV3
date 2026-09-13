<!-- src/editor/common/BaseSettings/BaseSettingsEditor.vue -->
<template>
  <!-- Key表示 -->
  <SettingItem
    v-if="isAssetCategory(category)"
    :label="t('baseSettings.key.label')"
    :description="t('baseSettings.key.description')"
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
    v-if="isIsEnabled"
    :label="t('baseSettings.isEnabled.label')"
    :description="t('baseSettings.isEnabled.description')"
  >
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
  </SettingItem>

  <!-- イベント名 -->
  <SettingItem :label="t('baseSettings.eventName.label')" :description="t('baseSettings.eventName.description')">
    <input type="text" v-model="name" class="input w-full" />
  </SettingItem>

  <!-- 説明 -->
  <SettingItem
    v-if="isDescription"
    :label="t('baseSettings.description.label')"
    :description="t('baseSettings.description.description')"
  >
    <input type="text" v-model="description" class="input w-full" />
  </SettingItem>

  <!-- タグ編集 -->
  <BaseTagEditor v-model="tags" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { BaseRecordType } from '@/types/core'
  import { assetCategory, AssetCategoryType, EventCategoryType } from '@/types/OmikujiData/'
  import BaseTagEditor from './BaseTagEditor.vue'
  import KeyEditor from '@/editor/helpers/KeyEditor/KeyEditor.vue'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  // vue-i18n の初期化
  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      modelValue: BaseRecordType
      category: EventCategoryType | AssetCategoryType | null
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

  const isAssetCategory = (c: EventCategoryType | AssetCategoryType | null): c is AssetCategoryType =>
    c !== null && assetCategory.includes(c as AssetCategoryType)

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
