<!-- src/editor/events/core/BoxChoiceEditor.vue -->
<template>
  <SettingItem
    :label="t('eventCore.boxChoiceEditor.omikujiKey.label')"
    :description="t('eventCore.boxChoiceEditor.omikujiKey.description')"
  >
    <select v-model="omikujiKey" class="select w-full">
      <option value="">{{ t('eventCore.boxChoiceEditor.omikujiKey.none') }}</option>
      <option v-for="(box, boxKey) in boxOptions" :key="boxKey" :value="boxKey">
        {{ box.name || boxKey }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { BaseEventType } from '@/types/OmikujiData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: BaseEventType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: BaseEventType]
  }>()

  const { getAssets } = useGetAssetData()

  const boxOptions = computed(() => getAssets('box'))

  const omikujiKey = computed({
    get: () => props.modelValue.omikujiKey,
    set: (value: string) => emit('update:modelValue', { ...props.modelValue, omikujiKey: value }),
  })
</script>
