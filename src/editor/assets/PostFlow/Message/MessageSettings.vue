<!-- src/editor/assets/PostFlow/Message/MessageSettings.vue -->
<template>
  <!-- 表示先の UI。UI ごとに下のフォームが変わる -->
  <SettingItem layout="vertical" :icon="uiKindMap[action.uiKey].icon" :label="t('postFlow.messageSettings.uiKey')">
    <select v-model="uiKey" class="select select-bordered w-full">
      <option v-for="kind in selectableKinds" :key="kind" :value="kind">{{ uiKindMap[kind].label }}</option>
    </select>
  </SettingItem>

  <!-- bubble を使う UI: キャラ・アイコン・本文 -->
  <template v-if="spec.bubble">
    <SettingItem layout="vertical" icon="User" :label="t('postFlow.common.character')">
      <CharacterPicker v-model="characterKey" />
    </SettingItem>

    <SettingItem
      v-if="!!action.characterKey"
      icon="Palette"
      layout="vertical"
      :label="t('postFlow.messageSettings.icon')"
    >
      <IconSelector :character-key="characterKey" :icon-key="action.iconKey" @update:icon-key="updateIconKey" />
    </SettingItem>

    <SettingItem
      v-if="spec.bubble === 'comment'"
      icon="MessageSquare"
      layout="vertical"
      :label="t('postFlow.messageSettings.message')"
    >
      <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
    </SettingItem>
  </template>

  <!-- UI ごとの slots (UiMessageSpecs の map から入力欄を作る) -->
  <SettingItem v-for="meta in slotMetas" :key="meta.slot" icon="MessageSquare" layout="vertical" :label="meta.title">
    <MessageTextDialog
      :modelValue="action.slots[meta.slot] ?? ''"
      :isCommentMode="true"
      @update:modelValue="updateSlot(meta.slot, $event)"
    />
    <p class="mt-1 text-xs opacity-60">{{ meta.description }}</p>
  </SettingItem>

  <!-- 投稿を受け取らない UI (データ不整合の保険) -->
  <p v-if="!spec.bubble && slotMetas.length === 0" class="text-sm opacity-60">
    {{ t('postFlow.messageSettings.noPost') }}
  </p>

  <SoundSettings
    v-if="soundEnabled"
    :action="action"
    @update:action="emit('update:action', $event as PostFlowMessageType)"
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import CharacterPicker from '@/editor/parts/CharacterPicker.vue'
  import { PostFlowMessageType } from '@/types/OmikujiData'
  import IconSelector from '@/editor/assets/PostFlow/IconSelector/IconSelector.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from './MessageTextDialog.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SoundSettings from '../Sounds/SoundSettings.vue'
  import { uiKindMap } from '@/maps/OmikujiData/ui'
  import { getUiMessageSpec, postUiKinds } from '@/types/generator'
  import type { UiKind } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowMessageType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowMessageType]
  }>()

  const { data } = storeToRefs(useOmikujiStore())

  const soundEnabled = computed(() => data.value.settings.generator.soundEnabled)

  const updateAction = (updates: Partial<PostFlowMessageType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const characterKey = computed({
    get: () => props.action.characterKey ?? '',
    set: (value) => updateAction({ characterKey: value }),
  })

  const bubbleText = computed<string>({
    get: () => props.action.message ?? '',
    set: (value) => updateAction({ message: value }),
  })

  const updateIconKey = (value: string) => {
    updateAction({ iconKey: value })
  }

  // 表示先の UI
  const spec = computed(() => getUiMessageSpec(props.action.uiKey))
  const slotMetas = computed(() => Object.values(spec.value.slots))
  // 投稿を受け取れる UI だけ選べる。現在値が受け取れない UI (データ不整合) の場合は、それも並べる
  const selectableKinds = computed<UiKind[]>(() =>
    postUiKinds.includes(props.action.uiKey) ? postUiKinds : [props.action.uiKey, ...postUiKinds]
  )
  const uiKey = computed<UiKind>({
    get: () => props.action.uiKey,
    set: (value) => updateAction({ uiKey: value }),
  })

  const updateSlot = (slot: string, value: string) => {
    updateAction({ slots: { ...props.action.slots, [slot]: value } })
  }
</script>
