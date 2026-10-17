<!-- src/editor/assets/PostFlow/gameScript/GameScriptSettings.vue -->
<template>
  <SettingItem label="ゲーム" description="実行するゲームスクリプトを選択">
    <select v-model="scriptId" class="select select-bordered select-sm w-full">
      <option value="">未選択</option>
      <option v-for="key in scriptGameKeys" :key="key" :value="key">
        {{ key }}
      </option>
    </select>
  </SettingItem>

  <SettingItem label="キャラクター" description="ゲームに使用するキャラクター">
    <select v-model="characterKey" class="select select-bordered select-sm w-full">
      <option value="">未選択</option>
      <option v-for="(value, key) in characterMap" :key="key" :value="key">
        {{ value.name }}
      </option>
    </select>
  </SettingItem>

  <SettingItem label="パラメータ" description="ゲームに渡す文字列">
    <input
      v-model="queryString"
      type="text"
      class="input input-bordered input-sm w-full"
      placeholder="パラメータを入力"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { PostFlowGameType } from '@/types/OmikujiData'
  import { scriptGameKeys } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

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
