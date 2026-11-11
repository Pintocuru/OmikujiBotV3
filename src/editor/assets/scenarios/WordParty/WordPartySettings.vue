<!-- src/editor/assets/scenarios/WordParty/WordPartySettings.vue -->
<template>
  <div class="space-y-2">
    <!-- WordParty ID -->
    <SettingItem icon="PartyPopper" label="WordParty" descriptionKey="scenarioStep.wordParty.idDesc">
      <input
        type="text"
        v-model="wordPartyIdValue"
        class="input input-bordered input-sm flex-1"
        placeholder="WordParty ID"
      />
    </SettingItem>

    <!-- Repeat -->
    <SettingItem
      icon="Repeat"
      labelKey="scenarioStep.wordParty.repeatLabel"
      descriptionKey="scenarioStep.wordParty.repeatDesc"
    >
      <div class="flex items-center gap-2 flex-1">
        <select v-model="repeatMode" class="select select-bordered select-sm w-32">
          <option v-for="mode in REPEAT_MODES" :key="mode" :value="mode">
            {{ t(`scenarioStep.wordParty.${mode}`) }}
          </option>
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

    <!-- Repeat の SettingItem の直後(isDev のみ) -->
    <SettingItem v-if="isDev" icon="ListChecks" label="config.js ID" layout="vertical" variant="warning">
      <WordPartyIdPicker class="flex-1" @select="wordPartyIdValue = $event" />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { ScenarioStepWordPartyType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { isDev } from '@/common/AppEnv'
  import WordPartyIdPicker from './WordPartyIdPicker.vue'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepWordPartyType
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepWordPartyType]
  }>()

  const REPEAT_MODES = ['none', 'fixed', 'viewer', 'upVote'] as const

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
