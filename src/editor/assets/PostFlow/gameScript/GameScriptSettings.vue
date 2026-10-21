<!-- src/editor/assets/PostFlow/gameScript/GameScriptSettings.vue -->
<template>
  <SettingItem layout="vertical" icon="Gamepad2" :label="t('postFlow.gameScript.gameLabel')" :description="t('postFlow.gameScript.gameDesc')">
    <select v-model="scriptId" class="select select-bordered select-sm w-full">
      <option value="">{{ t('postFlow.common.unselected') }}</option>
      <option v-for="key in getRegisteredGameScriptKeys()" :key="key" :value="key">
        {{ t(`mapText.gameMeta.${key}.name`) }}
      </option>
    </select>
  </SettingItem>

  <SettingItem layout="vertical" icon="User" :label="t('postFlow.common.character')" :description="t('postFlow.gameScript.characterDesc')">
    <select v-model="characterKey" class="select select-bordered select-sm w-full">
      <option value="">{{ t('postFlow.common.unselected') }}</option>
      <option v-for="(value, key) in characterMap" :key="key" :value="key">
        {{ value.name }}
      </option>
    </select>
  </SettingItem>

  <SettingItem layout="vertical" icon="Code2" :label="t('postFlow.gameScript.paramLabel')" :description="t('postFlow.gameScript.paramDesc')">
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
  import type { PostFlowGameType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'

  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowGameType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowGameType]
  }>()

  const { data } = useOmikujiStore()
  const { characterMap } = useCharacterManager(() => data.assets.characters)

  const updateAction = (updates: Partial<PostFlowGameType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  function createActionComputed<K extends keyof PostFlowGameType>(key: K) {
    return computed({
      get: () => props.action[key],
      set: (value: PostFlowGameType[K]) => updateAction({ [key]: value } as Partial<PostFlowGameType>),
    })
  }
  const scriptId = createActionComputed('scriptId')
  const characterKey = createActionComputed('characterKey')
  const queryString = createActionComputed('queryString')
</script>
