<!-- src/editor/assets/ScenarioStep/WordParty/WordPartySettings.vue -->
<template>
  <div class="space-y-2">
    <!-- WordParty ID -->
    <SettingItem layout="vertical" icon="PartyPopper" label="WordParty" descriptionKey="scenarioStep.wordParty.idDesc">
      <input
        type="text"
        v-model="wordPartyIdValue"
        class="input input-bordered input-sm flex-1"
        placeholder="WordParty ID"
      />
    </SettingItem>

    <!-- Repeat -->
    <SettingItem
      layout="vertical"
      icon="Repeat"
      labelKey="scenarioStep.wordParty.repeatLabel"
      descriptionKey="scenarioStep.wordParty.repeatDesc"
    >
      <div class="flex items-center gap-2 flex-1">
        <select v-model="repeatMode" class="select select-bordered select-sm w-32">
          <option value="none">{{ t('scenarioStep.wordParty.none') }}</option>
          <option value="fixed">{{ t('scenarioStep.wordParty.fixed') }}</option>
          <option value="viewer">{{ t('scenarioStep.wordParty.viewer') }}</option>
          <option value="upVote">{{ t('scenarioStep.wordParty.upVote') }}</option>
        </select>

        <input
          v-if="repeatMode === 'fixed'"
          type="number"
          v-model.number="repeatNumber"
          class="input input-bordered input-sm w-24"
          min="1"
          max="20"
          :placeholder="t('scenarioStep.wordParty.count')"
        />

        <span v-if="repeatMode === 'viewer' || repeatMode === 'upVote'" class="text-xs text-gray-500">
          {{ t('scenarioStep.wordParty.max') }}
        </span>
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { ScenarioStepWordPartyType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepWordPartyType
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepWordPartyType]
  }>()

  // 共通のupdateStep関数
  const updateStep = (updates: Partial<ScenarioStepWordPartyType>) => {
    emit('update:step', { ...props.step, ...updates })
  }

  // WordParty ID用のcomputedプロパティ
  const wordPartyIdValue = computed({
    get: () => props.step.wordPartyId,
    set: (value) => updateStep({ wordPartyId: value }),
  })

  // Repeat モードの判定
  const repeatMode = computed({
    get: (): 'none' | 'fixed' | 'viewer' | 'upVote' => {
      const repeat = props.step.repeat
      if (repeat === undefined) return 'none'
      if (typeof repeat === 'number') return 'fixed'
      if (repeat === 'viewer') return 'viewer'
      if (repeat === 'upVote') return 'upVote'
      return 'none'
    },
    set: (mode: 'none' | 'fixed' | 'viewer' | 'upVote') => {
      const repeatValues = {
        none: undefined,
        fixed: 1,
        viewer: 'viewer' as const,
        upVote: 'upVote' as const,
      }
      updateStep({ repeat: repeatValues[mode] })
    },
  })

  // 固定値の数値
  const repeatNumber = computed({
    get: (): number => {
      const repeat = props.step.repeat
      return typeof repeat === 'number' ? repeat : 1
    },
    set: (value: number) => {
      const clampedValue = Math.min(Math.max(value, 1), 20)
      updateStep({ repeat: clampedValue })
    },
  })
</script>
