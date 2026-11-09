<!-- src/editor/assets/characters/CharacterImage/EmotionImageItem.vue -->
<template>
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <label class="text-sm text-base-content/60 shrink-0">{{ t('characterImage.item.name') }}</label>
        <input
          type="text"
          class="input input-xs flex-1"
          :placeholder="emotionKey"
          v-model="localName"
          @blur="emit('update:label', localName)"
        />
      </div>
      <div class="flex items-center gap-2 mt-1">
        <label class="text-sm text-base-content/60 shrink-0">{{ t('characterImage.item.keyLabel') }}</label>
        <input
          type="text"
          class="input input-xs flex-1 font-mono"
          :class="{ 'input-error': keyError }"
          :disabled="keyLocked"
          v-model="localKey"
          @input="handleKeyInput"
          @blur="handleKeyBlur"
        />
      </div>
      <p v-if="keyError" class="text-xs text-error mt-1">{{ t(KEY_ERROR_MESSAGES[keyError]) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, watch } from 'vue'
  import type { EmotionKeyError } from './composables/emotionOperations'

  const { t } = useI18n()

  const props = defineProps<{
    emotionKey: string
    label: string
    isDefaultWarning?: boolean
    /** キーを変更できないか (default は固定) */
    keyLocked?: boolean
    /** 入力されたキーの検証。問題なければ null */
    validateKey?: (key: string) => EmotionKeyError | null
  }>()

  const emit = defineEmits<{
    'update:label': [label: string]
    rename: [key: string]
  }>()

  const KEY_ERROR_MESSAGES: Record<EmotionKeyError, string> = {
    empty: 'characterImage.item.keyEmpty',
    numeric: 'characterImage.numericKeyError',
    invalidChar: 'characterImage.item.keyInvalidChar',
    duplicate: 'characterImage.item.keyDuplicate',
  }

  const localName = ref(props.label)

  watch(
    () => props.label,
    (val) => {
      localName.value = val
    }
  )

  // キー: 有効な入力だけを親(ドラフト)へ渡す。無効な入力は赤く表示し、フォーカスを外したら元のキーに戻す
  const localKey = ref(props.emotionKey)
  const keyError = ref<EmotionKeyError | null>(null)

  watch(
    () => props.emotionKey,
    (val) => {
      localKey.value = val
      keyError.value = null
    }
  )

  const handleKeyInput = () => {
    keyError.value = props.validateKey?.(localKey.value) ?? null
    if (!keyError.value) emit('rename', localKey.value.trim())
  }

  const handleKeyBlur = () => {
    if (!keyError.value) return
    localKey.value = props.emotionKey
    keyError.value = null
  }
</script>
