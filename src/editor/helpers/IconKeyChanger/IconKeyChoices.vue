<!-- src/editor/helpers/IconKeyChanger/IconKeyChoices.vue -->
<!-- 指定キャラクターの「画像のある表情」をサムネイルで選ばせる。'' は「変更しない」 -->
<template>
  <p v-if="!character" class="text-sm text-warning">{{ t('iconKeyChanger.characterUndefinedHint') }}</p>
  <p v-else-if="choices.length === 0" class="text-sm opacity-60">{{ t('iconKeyChanger.noSelectableIcon') }}</p>
  <div v-else class="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1" role="radiogroup">
    <button
      type="button"
      role="radio"
      :aria-checked="modelValue === ''"
      class="flex min-h-14 w-20 items-center justify-center rounded-lg border-2 p-1 text-center text-xs transition cursor-pointer"
      :class="modelValue === '' ? 'border-primary bg-base-200' : 'border-dashed border-base-300 hover:border-primary'"
      @click="emit('update:modelValue', '')"
    >
      {{ t('mapping.noChange') }}
    </button>

    <button
      v-for="choice in choices"
      :key="choice.key"
      type="button"
      role="radio"
      :aria-checked="modelValue === choice.key"
      :title="choice.key"
      class="flex w-20 flex-col items-center gap-1 rounded-lg p-1 transition cursor-pointer"
      :class="
        modelValue === choice.key ? 'bg-primary text-primary-content' : 'border-2 border-base-300 hover:border-primary'
      "
      @click="emit('update:modelValue', choice.key)"
    >
      <CharacterThumb :character="character" :icon-key="choice.key" :size="48" />
      <span class="w-full truncate text-center text-xs">{{ choice.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CharacterThumb from '@/editor/parts/CharacterPicker/CharacterThumb.vue'
  import type { CharacterType } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    character: CharacterType | null // 未定義なら null
    modelValue: string // 選択中の iconKey(''=変更しない)
  }>()

  const emit = defineEmits<{
    'update:modelValue': [iconKey: string]
  }>()

  // 画像(src)のある表情だけを選択肢にする
  const choices = computed(() =>
    Object.entries(props.character?.image ?? {})
      .filter(([, item]) => item?.src.some((path) => path && path.trim()))
      .map(([key, item]) => ({ key, label: item.label || key }))
  )
</script>
