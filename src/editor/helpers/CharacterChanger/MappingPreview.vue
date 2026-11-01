<!-- src/editor/helpers/CharacterChanger/MappingPreview.vue -->
<template>
  <div class="alert alert-warning">
    <AlertTriangle class="w-4 h-4" />
    <div class="flex-1">
      <span class="font-semibold">{{ t('mapping.review') }}</span>
      <ul class="text-sm mt-2 space-y-1">
        <li v-for="(newCharId, oldCharKey) in characterMappings" :key="oldCharKey">
          <span v-if="newCharId">
            {{
              t('mapping.itemChange', {
                before: getCharacterName(oldCharKey) || oldCharKey,
                after: getCharacterName(newCharId),
                usageCount: usageCountLabel(usageCount[oldCharKey]),
              })
            }}
          </span>
        </li>
      </ul>
      <p class="text-sm mt-3 font-semibold text-warning-content">
        {{ t('mapping.caution', { scope: scopeLabel }) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useCharacterLookup } from './composables/useCharacterLookup'
  import { AlertTriangle } from 'lucide-vue-next'

  const { t } = useI18n()

  defineProps<{
    characterMappings: Record<string, string>
    usageCount: Record<string, number>
    scopeLabel: string
  }>()

  const { getCharacterName } = useCharacterLookup()

  const usageCountLabel = (count: number) => t(`mapping.usageCount.${count === 1 ? 'one' : 'other'}`, { count })
</script>
