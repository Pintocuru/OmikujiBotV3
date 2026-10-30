<!-- src/editor/assets/ScenarioStep/Sounds/SoundSettings.vue -->
<template>
  <SettingItem
    icon="Volume2"
    layout="vertical"
    :label="t('scenarioStep.sound.label')"
    :description="t('scenarioStep.sound.desc')"
  >
    <!-- プリセット選択 -->
    <select v-model="sound" class="select select-bordered select-sm w-full">
      <option value="">{{ t('scenarioStep.common.none') }}</option>
      <option v-for="(_, key) in soundMap" :key="key" :value="key">{{ t(`mapText.sound.${key}`) }} ({{ key }})</option>
    </select>
  </SettingItem>

  <!-- カスタムパス -->
  <SettingItem
    icon="Volume2"
    layout="vertical"
    :label="t('scenarioStep.sound.customLabel')"
    :description="t('scenarioStep.sound.customDesc')"
  >
    <input
      v-model="soundPath"
      type="text"
      :placeholder="t('scenarioStep.sound.customPlaceholder')"
      class="input input-bordered input-sm w-full"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { ScenarioStepMessageType, ScenarioStepSoundType } from '@/types/OmikujiData'
  import { soundMap } from '@/maps/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepMessageType | ScenarioStepSoundType
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepMessageType | ScenarioStepSoundType]
  }>()

  const updateStep = (updates: Partial<ScenarioStepMessageType | ScenarioStepSoundType>) => {
    const updatedStep = { ...props.step, ...updates } as ScenarioStepMessageType | ScenarioStepSoundType
    emit('update:step', updatedStep)
  }

  // プリセット選択時は soundPath をクリア
  const sound = computed({
    get: () => props.step.sound || '',
    set: (value) => updateStep({ sound: value || undefined, soundPath: '' }),
  })

  // カスタムパス入力時は sound をクリア
  const soundPath = computed({
    get: () => props.step.soundPath || '',
    set: (value) => updateStep({ soundPath: value || '', sound: value ? '' : props.step.sound }),
  })
</script>
