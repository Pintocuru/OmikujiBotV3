<!-- src/editor/helpers/IconKeyChanger/IconKeyMappingPreview.vue -->
<template>
  <div class="alert alert-warning">
    <AlertTriangle class="w-4 h-4" />
    <div class="flex-1">
      <span class="font-semibold">{{ t('mapping.review') }}</span>
      <ul class="text-sm mt-2 space-y-1">
        <li v-for="(newKey, compositeKey) in iconKeyMappings" :key="compositeKey">
          <span v-if="newKey">
            {{
              t('mapping.itemChange', {
                before: formatLabel(compositeKey),
                after: newKey,
                usageCount: usageCountLabel(usageCount[compositeKey] ?? 0),
              })
            }}
          </span>
        </li>
      </ul>
      <p class="text-sm mt-3 font-semibold text-warning-content">
        {{ t('mapping.caution') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { AlertTriangle } from 'lucide-vue-next'
  import { useCharacterLookup } from '../CharacterChanger/composables/useCharacterLookup'
  import { parseCompositeKey } from './compositeKey'

  const { t } = useI18n()

  defineProps<{
    iconKeyMappings: Record<string, string>
    usageCount: Record<string, number>
  }>()

  const { getCharacterName } = useCharacterLookup()

  const usageCountLabel = (count: number) => t(`mapping.usageCount.${count === 1 ? 'one' : 'other'}`, { count })

  // "characterKey:iconKey" → 表示用ラベル
  const formatLabel = (compositeKey: string): string => {
    const { characterKey, iconKey } = parseCompositeKey(compositeKey)
    const character = getCharacterName(characterKey) || characterKey || t('mapping.emptyKey')
    return t('iconKeyChanger.mappingBeforeValue', { character, iconKey: iconKey || t('mapping.emptyKey') })
  }
</script>
