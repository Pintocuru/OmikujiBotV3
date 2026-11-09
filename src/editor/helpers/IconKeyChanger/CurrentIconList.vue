<!-- src/editor/helpers/IconKeyChanger/CurrentIconList.vue -->
<template>
  <div class="bg-base-200 p-4 rounded-lg space-y-3">
    <p class="text-sm font-semibold text-gray-600">{{ t('iconKeyChanger.currentListTitle') }}</p>
    <p v-if="groups.length === 0" class="text-sm text-gray-500">
      {{ t('iconKeyChanger.emptyList') }}
    </p>
    <div v-for="group in groups" :key="group.characterKey">
      <div class="mb-1 flex items-center gap-2">
        <CharacterThumb :character="getCharacter(group.characterKey)" :size="24" />
        <span class="text-xs text-gray-500">
          {{ getCharacterName(group.characterKey) || group.characterKey || t('mapping.emptyKey') }}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="icon in group.icons"
          :key="icon.iconKey"
          :class="[
            'badge badge-lg h-auto gap-2 py-1 pl-1',
            icon.invalid ? 'badge-error animate-pulse' : 'badge-outline',
          ]"
        >
          <CharacterThumb
            :character="getCharacter(group.characterKey)"
            :icon-key="icon.iconKey"
            :unknown="icon.invalid"
            :size="28"
          />
          {{ icon.invalid ? '⚠️ ' : '' }}{{ icon.iconKey || t('mapping.emptyKey') }}
          <span class="ml-1 text-xs opacity-70">({{ usageCountLabel(icon.count) }})</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import CharacterThumb from '@/editor/parts/CharacterPicker/CharacterThumb.vue'
  import { useCharacterLookup } from '../CharacterChanger/composables/useCharacterLookup'
  import type { UsedIconGroup } from './composables/useUsedIconGroups'

  const { t } = useI18n()

  defineProps<{
    groups: UsedIconGroup[]
  }>()

  const { getCharacter, getCharacterName } = useCharacterLookup()

  const usageCountLabel = (count: number) => t(`mapping.usageCount.${count === 1 ? 'one' : 'other'}`, { count })
</script>

<style scoped src="@/editor/helpers/shared/softPulse.css"></style>
