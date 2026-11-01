<!-- src/editor/helpers/CharacterChanger/CharacterStatistics.vue -->
<template>
  <div class="stats stats-vertical sm:stats-horizontal shadow w-full">
    <div class="stat">
      <div class="stat-title">{{ t('characterChanger.statistics.items') }}</div>
      <div class="stat-value text-primary">{{ totalItems }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">{{ t('characterChanger.statistics.characters') }}</div>
      <div class="stat-value text-secondary">{{ uniqueCharacterCount }}</div>
    </div>
    <div class="stat" :class="hasInvalidCharacters ? 'bg-error/10' : ''">
      <div class="stat-title">{{ t('characterChanger.statistics.undefinedCharacters') }}</div>
      <div :class="['stat-value', hasInvalidCharacters ? 'text-error' : 'text-success']">
        {{ invalidCharacterCount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  defineProps<{
    totalItems: number
    uniqueCharacterCount: number
    invalidCharacterCount: number
    hasInvalidCharacters: boolean
  }>()
</script>
