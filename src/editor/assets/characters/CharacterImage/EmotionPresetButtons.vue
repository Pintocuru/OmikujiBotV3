<!-- src/editor/assets/characters/CharacterImage/EmotionPresetButtons.vue -->
<template>
  <div class="flex flex-wrap gap-1">
    <span class="text-xs text-base-content/50 self-center mr-1">{{ t('characterImage.preset.label') }}</span>
    <button
      v-for="(value, key) in characterEmotionMap"
      :key="key"
      type="button"
      class="btn btn-xs"
      :class="existingKeys.includes(key) ? 'btn-disabled opacity-40' : 'btn-outline'"
      :disabled="existingKeys.includes(key)"
      @click="emit('add', key, t(`mapText.characterEmotion.${key}.label`))"
    >
      {{ t(`mapText.characterEmotion.${key}.label`) }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { characterEmotionMap } from '@/maps/OmikujiData'

  const { t } = useI18n()

  defineProps<{
    existingKeys: string[]
  }>()

  const emit = defineEmits<{
    add: [key: string, label: string]
  }>()
</script>
