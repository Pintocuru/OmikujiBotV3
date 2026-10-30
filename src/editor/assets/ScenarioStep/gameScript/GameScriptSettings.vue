<!-- src/editor/assets/PostFlow/gameScript/GameScriptSettings.vue -->
<template>
  <!-- 実行するゲームスクリプト -->
  <SettingItem layout="vertical" icon="Gamepad2" :label="t('postFlow.gameScript.gameLabel')">
    <IconRadioGroup
      v-model="scriptId"
      :map="gameMetaMap"
      :keys="gameKeys"
      allow-empty
      :empty-label="t('postFlow.common.unselected')"
      :aria-label="t('postFlow.gameScript.gameLabel')"
    />
  </SettingItem>

  <!-- キャラクター -->
  <SettingItem layout="vertical" icon="User" :label="t('postFlow.common.character')">
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
    :label="t('postFlow.gameScript.paramLabel')"
    :description="t('postFlow.gameScript.paramDesc')"
  >
    <input
      v-model="queryString"
      type="text"
      class="input input-bordered input-sm w-full"
      :placeholder="t('postFlow.gameScript.paramPlaceholder')"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { isGameScriptKey, type GameScriptKey, type ScenarioStepGameType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'
  import CharacterIconPicker from '@/editor/parts/CharacterPicker/CharacterIconPicker.vue'
  import { gameMetaMap } from '@/maps/games'
  import IconRadioGroup from '@/editor/parts/IconRadioGroup.vue'

  const { t } = useI18n()

  const props = defineProps<{
    action: ScenarioStepGameType
  }>()

  const emit = defineEmits<{
    'update:action': [action: ScenarioStepGameType]
  }>()

  const updateAction = (updates: Partial<ScenarioStepGameType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const gameKeys = getRegisteredGameScriptKeys()

  const scriptId = computed<GameScriptKey | ''>({
    get: () => (isGameScriptKey(props.action.scriptId) ? props.action.scriptId : ''),
    set: (value) => updateAction({ scriptId: value }),
  })

  function createActionComputed<K extends keyof ScenarioStepGameType>(key: K) {
    return computed({
      get: () => props.action[key],
      set: (value: ScenarioStepGameType[K]) => updateAction({ [key]: value } as Partial<ScenarioStepGameType>),
    })
  }
  const characterKey = createActionComputed('characterKey')
  const queryString = createActionComputed('queryString')
</script>
