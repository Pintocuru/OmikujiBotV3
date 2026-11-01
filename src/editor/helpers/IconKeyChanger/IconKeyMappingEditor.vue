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
      :key="`${pair.characterKey}:${pair.iconKey}`"
      class="flex items-center gap-3 p-4 bg-base-100 rounded-lg border-2 border-error shadow-error/20 shadow-lg"
    >
      <!-- 変更前 -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 mb-1">{{ t('mapping.before') }}</p>
        <div class="badge badge-lg badge-error w-full justify-start truncate">
          ⚠️ {{ pair.iconKey || t('mapping.emptyKey') }}
        </div>
        <p class="text-xs text-gray-400 mt-1">
          {{ getCharacterName(pair.characterKey) || pair.characterKey }} /
          {{ usageCountLabel(usageCount[`${pair.characterKey}:${pair.iconKey}`] ?? 0) }}
        </p>
      </div>

      <!-- 矢印 -->
      <div class="text-3xl text-gray-400 shrink-0">→</div>

      <!-- 変更後 -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 mb-1">{{ t('mapping.after') }}</p>
        <select
          :value="getMappingValue(`${pair.characterKey}:${pair.iconKey}`)"
          @input="
            $emit('updateMapping', `${pair.characterKey}:${pair.iconKey}`, ($event.target as HTMLSelectElement).value)
          "
          class="select select-bordered w-full"
          :class="getMappingValue(`${pair.characterKey}:${pair.iconKey}`) ? 'select-primary' : ''"
        >
          <option value="">{{ t('mapping.noChange') }}</option>
          <option v-for="iconKey in getValidIconKeys(pair.characterKey)" :key="iconKey" :value="iconKey">
            {{ iconKey }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useCharacterLookup } from '../CharacterChanger/composables/useCharacterLookup'

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

  const { characterMap, getCharacterName } = useCharacterLookup()

  const usageCountLabel = (count: number) => t(`mapping.usageCount.${count === 1 ? 'one' : 'other'}`, { count })

  const getMappingValue = (compositeKey: string) => props.iconKeyMappings[compositeKey] || ''

  /**
   * 指定キャラクターの有効なiconKey一覧（src が存在するもの）
   */
  const getValidIconKeys = (characterKey: string): string[] => {
    const character = characterMap.value[characterKey]

    if (!character) return []
    return Object.entries(character.image)
      .filter(([_, item]) => item?.src.some((p) => p && p.trim()))
      .map(([key]) => key)
  }
</script>
