<!-- src/editor/assets/PostFlow/Message/MessageSettings.vue -->
<template>
  <SettingItem label="👤キャラクター・カラー" description="フキダシの色や読み上げのキャラクターを選択">
    <select v-model="characterKey" class="select select-bordered select-sm w-full max-w-xs">
      <option v-for="(name, key) in availableCharacters" :key="key" :value="key">
        {{ name }}
      </option>
    </select>
  </SettingItem>

  <SettingItem v-if="hasCharacterSelected" label="🎨 アイコン" description="表示する画像を選択">
    <IconSelector :character-key="characterKey" :icon-key="action.iconKey" @update:icon-key="updateIconKey" />
  </SettingItem>

  <SettingItem v-if="enableSecondary" label="読み上げ対象" description="わんコメで読み上げするか">
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="!isToast"
        @change="isToast = !($event.target as HTMLInputElement).checked"
      />
      <span>読み上げ対象 {{ !isToast ? 'ON' : 'OFF' }}</span>
    </label>
  </SettingItem>

  <SettingItem label="💬 メッセージ内容" description="プレースホルダーが使えます">
    <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
  </SettingItem>

  <SoundSettings
    v-if="soundEnabled"
    :action="action"
    @update:action="emit('update:action', $event as PostFlowMessageType)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostFlowMessageType } from '@/types'
  import IconSelector from '@/editor/assets/PostFlow/IconSelector/IconSelector.vue'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import MessageTextDialog from './MessageTextDialog.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SoundSettings from '../Sounds/SoundSettings.vue'
  import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager.js'

  const props = defineProps<{
    action: PostFlowMessageType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowMessageType]
  }>()

  const { data } = useOmikujiStore()
  const { characterMap } = useCharacterManager()

  const enableSecondary = computed(() => data.components.enableSecondary)
  const soundEnabled = computed(() => data.settings.generator.soundEnabled)

  const availableCharacters = computed(() =>
    Object.fromEntries(Object.entries(characterMap.value).map(([k, v]) => [k, v.name]))
  )

  const hasCharacterSelected = computed(() => !!props.action.characterKey)

  const updateAction = (updates: Partial<PostFlowMessageType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const characterKey = computed({
    get: () => props.action.characterKey ?? '',
    set: (value) => updateAction({ characterKey: value }),
  })

  const isToast = computed<boolean>({
    get: () => props.action.message.isToast,
    set: (value) =>
      updateAction({
        message: { ...props.action.message, isToast: value },
      }),
  })

  const bubbleText = computed<string>({
    get: () => props.action.message.bubble ?? '',
    set: (value) =>
      updateAction({
        message: { ...props.action.message, bubble: value },
      }),
  })

  const updateIconKey = (value: string) => {
    updateAction({ iconKey: value })
  }
</script>
