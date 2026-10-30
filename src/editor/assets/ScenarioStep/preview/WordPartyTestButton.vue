<!-- src/editor/assets/ScenarioStep/preview/WordPartyTestButton.vue -->
<template>
  <button @click="handleClick" :disabled="!id" class="btn btn-xs btn-secondary">
    {{ t('scenarioStep.tests.wordParty') }}
  </button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { executeWordParty } from '@/sdk/post/PostWordParty'

  const { t } = useI18n()

  const props = defineProps<{
    id?: string
    repeat?: number | 'viewer' | 'upVote'
  }>()

  function normalizeRepeat(repeat: number | 'viewer' | 'upVote' | undefined): number {
    if (repeat === 'viewer' || repeat === 'upVote') {
      return Math.floor(Math.random() * 30) + 1
    }
    return repeat ?? 1
  }

  function handleClick() {
    executeWordParty({
      wordPartyId: props.id,
      repeat: normalizeRepeat(props.repeat),
    }).catch((err) => {
      console.error('WordPartyテスト実行エラー:', err)
    })
  }
</script>
