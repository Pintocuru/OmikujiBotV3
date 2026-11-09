<!-- src/editor/helpers/CharacterChanger/CurrentCharacterList.vue -->
<template>
  <div class="bg-base-200 p-4 rounded-lg">
    <!-- 現在使用されているキャラクター -->
    <p class="text-sm font-semibold text-gray-600 mb-3">{{ t('characterChanger.currentListTitle') }}</p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="charKey in characterKeys"
        :key="charKey"
        :class="['badge badge-lg', getCharacterName(charKey) ? 'badge-outline' : 'badge-error animate-pulse']"
      >
        {{ getCharacterName(charKey) || `⚠️ ${t('mapping.undefinedKey', { key: charKey || t('mapping.emptyKey') })}` }}
        <span class="ml-1 text-xs opacity-70">({{ usageCountLabel(usageCount[charKey]) }})</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useCharacterLookup } from './composables/useCharacterLookup'

  const { t } = useI18n()

  defineProps<{
    characterKeys: string[]
    usageCount: Record<string, number>
  }>()

  const { getCharacterName } = useCharacterLookup()

  const usageCountLabel = (count: number) => t(`mapping.usageCount.${count === 1 ? 'one' : 'other'}`, { count })
</script>

<style scoped src="@/editor/helpers/shared/softPulse.css"></style>
