<!-- src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue -->
<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold text-md">{{ t('iconKeyChanger.mappingTitle') }}</h4>
      <button class="btn btn-sm btn-ghost" @click="$emit('clearAll')" :disabled="!hasChanges">
        {{ t('mapping.clearAll') }}
      </button>
    </div>

    <div
      v-for="pair in invalidPairs"
      :key="toCompositeKey(pair.characterKey, pair.iconKey)"
      class="flex items-start gap-3 p-4 bg-base-100 rounded-lg border-2 border-error shadow-error/20 shadow-lg"
    >
      <!-- 変更前 -->
      <div class="w-40 shrink-0">
        <p class="text-xs text-gray-500 mb-1">{{ t('mapping.before') }}</p>
        <div class="badge badge-lg badge-error h-auto w-full justify-start gap-2 py-1 pl-1">
          <CharacterThumb :character="getCharacter(pair.characterKey)" unknown :size="28" />
          <span class="truncate">⚠️ {{ pair.iconKey || t('mapping.emptyKey') }}</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          {{ getCharacterName(pair.characterKey) || pair.characterKey }} /
          {{ usageCountLabel(usageCount[toCompositeKey(pair.characterKey, pair.iconKey)] ?? 0) }}
        </p>
      </div>

      <!-- 矢印 -->
      <div class="text-3xl text-gray-400 shrink-0">→</div>

      <!-- 変更後 -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 mb-1">{{ t('mapping.after') }}</p>
        <IconKeyChoices
          :character="getCharacter(pair.characterKey)"
          :model-value="getMappingValue(toCompositeKey(pair.characterKey, pair.iconKey))"
          @update:model-value="
            (value: string) => $emit('updateMapping', toCompositeKey(pair.characterKey, pair.iconKey), value)
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import CharacterThumb from '@/editor/parts/CharacterPicker/CharacterThumb.vue'
  import { useCharacterLookup } from '../CharacterChanger/composables/useCharacterLookup'
  import IconKeyChoices from './IconKeyChoices.vue'
  import { toCompositeKey } from './compositeKey'

  const { t } = useI18n()

  const props = defineProps<{
    invalidPairs: { characterKey: string; iconKey: string }[]
    iconKeyMappings: Record<string, string>
    usageCount: Record<string, number>
    hasChanges: boolean
  }>()

  defineEmits<{
    clearAll: []
    updateMapping: [compositeKey: string, value: string]
  }>()

  const { getCharacter, getCharacterName } = useCharacterLookup()

  const usageCountLabel = (count: number) => t(`mapping.usageCount.${count === 1 ? 'one' : 'other'}`, { count })

  const getMappingValue = (compositeKey: string) => props.iconKeyMappings[compositeKey] || ''
</script>
