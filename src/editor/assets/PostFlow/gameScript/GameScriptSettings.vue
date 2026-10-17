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
      <option v-for="(name, key) in availableCharacters" :key="key" :value="key">
        {{ name }}
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

  const availableCharacters = computed(() =>
    Object.fromEntries(Object.entries(characterMap.value).map(([key, character]) => [key, character.name]))
  )

  const updateAction = (updates: Partial<PostFlowGameType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const scriptId = computed({
    get: () => props.action.scriptId,
    set: (value: string) => updateAction({ scriptId: value }),
  })

  const characterKey = computed({
    get: () => props.action.characterKey,
    set: (value: string) => updateAction({ characterKey: value }),
  })

  const queryString = computed({
    get: () => props.action.queryString,
    set: (value: string) => updateAction({ queryString: value }),
  })
</script>
