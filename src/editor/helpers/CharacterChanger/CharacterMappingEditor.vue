<!-- src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue -->
<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold text-md">{{ t('characterChanger.mappingTitle') }}</h4>
      <button class="btn btn-sm btn-ghost" @click="$emit('clearAll')" :disabled="!hasChanges">
        {{ t('mapping.clearAll') }}
      </button>
    </div>

    <div
      v-for="charKey in characterKeys"
      :key="charKey"
      class="flex items-center gap-3 p-4 bg-base-100 rounded-lg border-2 transition-all"
      :class="getCharacterName(charKey) ? 'border-base-300' : 'border-error shadow-error/20 shadow-lg'"
    >
      <!-- 変更前 -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 mb-1">{{ t('mapping.before') }}</p>
        <div
          :class="[
            'badge badge-lg w-full justify-start truncate',
            getCharacterName(charKey) ? 'badge-outline' : 'badge-error',
          ]"
        >
          {{
            getCharacterName(charKey) || `⚠️ ${t('mapping.undefinedKey', { key: charKey || t('mapping.emptyKey') })}`
          }}
        </div>
        <p class="text-xs text-gray-400 mt-1">{{ usageInUse(usageCount[charKey]) }}</p>
      </div>

      <!-- 矢印 -->
      <div class="text-3xl text-gray-400 shrink-0">→</div>

      <!-- 変更後 -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 mb-1">{{ t('mapping.after') }}</p>
        <select
          :value="getMappingValue(charKey)"
          @input="updateMapping(charKey, ($event.target as HTMLSelectElement).value)"
          class="select select-bordered w-full"
          :class="getMappingValue(charKey) ? 'select-primary' : ''"
        >
          <option value="">{{ t('mapping.noChange') }}</option>
          <option v-for="character in characterArray" :key="character.key" :value="character.key">
            {{ character.name || character.key }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useCharacterLookup } from './composables/useCharacterLookup'

  const { t } = useI18n()

  const props = defineProps<{
    characterKeys: string[]
    characterMappings: Record<string, string>
    usageCount: Record<string, number>
    hasChanges: boolean
  }>()

  const emit = defineEmits<{
    clearAll: []
    updateMapping: [charKey: string, value: string]
  }>()

  const { characterArray, getCharacterName } = useCharacterLookup()

  const usageInUse = (count: number) => t(`mapping.usageInUse.${count === 1 ? 'one' : 'other'}`, { count })

  // マッピング値を取得
  const getMappingValue = (charKey: string) => props.characterMappings[charKey] || ''

  // マッピング値を更新
  const updateMapping = (charKey: string, value: string) => {
    emit('updateMapping', charKey, value)
  }
</script>
