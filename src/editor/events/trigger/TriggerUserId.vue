<!-- shared/components/threshold/ThresholdUserId.vue -->
<template>
  <SettingItem
    label="適用するユーザーID"
    description="ユーザーIDを指定します。改行で複数指定できます。先頭に!をつけるとネガティブ（除外）になります"
  >
    <textarea
      v-model="textValue"
      @input="updateModelValue"
      placeholder="例:
user123456
user789012
!excludeUser
!anotherExcludeUser"
      class="textarea textarea-bordered w-full min-h-[120px]"
      rows="6"
    />
    <div class="text-sm text-gray-500 mt-2">
      <p>• 通常のユーザーID: そのユーザーのみが条件対象となります</p>
      <p>• ネガティブ指定(!付き): そのユーザーを条件から除外します</p>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const props = defineProps<{
    modelValue?: string[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // textarea用の文字列値
  const textValue = ref('')

  // 初期値設定
  textValue.value = (props.modelValue ?? []).join('\n')

  watch(
    () => props.modelValue,
    (newValue) => {
      const newText = (newValue ?? []).join('\n')
      if (textValue.value !== newText) {
        textValue.value = newText
      }
    }
  )

  // textareaの値が変更された時にmodelValueを更新
  const updateModelValue = () => {
    const lines = textValue.value.split('\n')
    emit('update:modelValue', lines)
  }
</script>
