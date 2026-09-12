<!-- shared/components/threshold/ThresholdUsername.vue -->
<template>
  <SettingItem label="適用するユーザー名" description="先頭に「!」で除外指定します。改行で複数指定。">
    <textarea
      v-model="textValue"
      @input="updateModelValue"
      placeholder="例:
!管理者名
!テストユーザー"
      class="textarea textarea-bordered w-full min-h-30"
      rows="6"
    />
    <div class="text-sm text-gray-500 mt-2">
      <p>• 正規表現でユーザー名をマッチングします</p>
      <p>• 通常の指定: マッチしたユーザー名が条件対象となります</p>
      <p>• ネガティブ指定(!付き): マッチしたユーザー名を条件から除外します</p>
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
