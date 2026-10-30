<!-- src/editor/assets/ScenarioStep/gameScript/GameScriptSettings.vue -->
<template>
  <!-- 実行するゲームスクリプト -->
  <SettingItem layout="vertical" icon="Gamepad2" :label="t('scenarioStep.gameScript.gameLabel')">
    <IconRadioGroup
      v-model="scriptId"
      :map="gameMetaMap"
      :keys="gameKeys"
      allow-empty
      :empty-label="t('scenarioStep.common.unselected')"
      :aria-label="t('scenarioStep.gameScript.gameLabel')"
    />
  </SettingItem>

  <!-- キャラクター -->
  <SettingItem layout="vertical" icon="User" :label="t('scenarioStep.common.character')">
    <CharacterIconPicker
      :character-key="characterKey"
      :is-icon-key="false"
      @select="characterKey = $event.characterKey"
    />
  </SettingItem>

  <!-- パラメータ -->
  <SettingItem
    layout="vertical"
    icon="Code2"
    :label="t('scenarioStep.gameScript.paramLabel')"
    :description="t('scenarioStep.gameScript.paramDesc')"
  >
    <input
      v-model="queryString"
      type="text"
      class="input input-bordered input-sm w-full"
      :placeholder="t('scenarioStep.gameScript.paramPlaceholder')"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { isGameScriptKey, type GameScriptKey, type ScenarioStepGameScriptType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'
  import CharacterIconPicker from '@/editor/parts/CharacterPicker/CharacterIconPicker.vue'
  import { gameMetaMap } from '@/maps/games'
  import IconRadioGroup from '@/editor/parts/IconRadioGroup.vue'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepGameScriptType
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepGameScriptType]
  }>()

  const updateStep = (updates: Partial<ScenarioStepGameScriptType>) => {
    emit('update:step', { ...props.step, ...updates })
  }

  const gameKeys = getRegisteredGameScriptKeys()

  const scriptId = computed<GameScriptKey | ''>({
    get: () => (isGameScriptKey(props.step.scriptId) ? props.step.scriptId : ''),
    set: (value) => updateStep({ scriptId: value }),
  })

  function createStepComputed<K extends keyof ScenarioStepGameScriptType>(key: K) {
    return computed({
      get: () => props.step[key],
      set: (value: ScenarioStepGameScriptType[K]) =>
        updateStep({ [key]: value } as Partial<ScenarioStepGameScriptType>),
    })
  }
  const characterKey = createStepComputed('characterKey')
  const queryString = createStepComputed('queryString')
</script>
