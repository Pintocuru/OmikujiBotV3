<!-- src/editor/assets/ScenarioStep/Message/MessageSettings.vue -->
<template>
  <!-- 表示先のUI UIごとに下のフォームが変わる -->
  <SettingItem layout="vertical" :icon="uiKindMap[action.uiKey].icon" :label="t('scenarioStep.messageSettings.uiKey')">
    <IconRadioGroup
      v-model="uiKey"
      :map="uiKindMap"
      :keys="selectableKinds"
      :aria-label="t('scenarioStep.messageSettings.uiKey')"
    />
  </SettingItem>

  <!-- bubble を使う UI: キャラ・アイコン・本文 -->
  <template v-if="spec.bubble">
    <!-- キャラクター選択 -->
    <SettingItem layout="vertical" icon="User" :label="t('scenarioStep.common.character')">
      <CharacterIconPicker
        :character-key="action.characterKey ?? ''"
        :icon-key="action.iconKey"
        @select="updateAction"
      />
    </SettingItem>

    <!-- メッセージ -->
    <SettingItem
      v-if="spec.bubble === 'comment'"
      icon="MessageSquare"
      layout="vertical"
      :label="t('scenarioStep.messageSettings.message')"
    >
      <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
    </SettingItem>
  </template>

  <!-- UI ごとの slots (UiMessageSpecs の map から入力欄を作る) -->
  <component
    v-if="slotsEditor"
    :is="slotsEditor"
    :slots="action.slots"
    @update:slots="updateAction({ slots: $event })"
  />
  <SettingItem
    v-else-if="slotMetas.length > 0"
    icon="MessageSquare"
    layout="vertical"
    :label="t('scenarioStep.messageSettings.slots')"
  >
    <div v-for="meta in slotMetas" :key="meta.slot" class="mb-2">
      <p class="mb-1 text-sm font-medium">
        {{ meta.title }}
        <span class="ml-2 text-xs opacity-60">
          {{ meta.description }}
        </span>
      </p>

      <input
        type="text"
        class="input input-bordered input-sm w-full"
        :value="action.slots[meta.slot] ?? ''"
        @input="updateSlot(meta.slot, ($event.target as HTMLInputElement).value)"
      />
    </div>
  </SettingItem>

  <!-- 投稿を受け取らない UI (データ不整合の保険) -->
  <p v-if="!spec.bubble && slotMetas.length === 0" class="text-sm opacity-60">
    {{ t('scenarioStep.messageSettings.noPost') }}
  </p>

  <SoundSettings
    v-if="soundEnabled"
    :action="action"
    @update:action="emit('update:action', $event as ScenarioStepMessageType)"
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import CharacterIconPicker from '@/editor/parts/CharacterPicker/CharacterIconPicker.vue'
  import { ScenarioStepMessageType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from './MessageTextDialog.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SoundSettings from '../Sounds/SoundSettings.vue'
  import { uiKindMap } from '@/maps/OmikujiData/ui'
  import { getUiMessageSpec, postUiKinds } from '@/types/generator'
  import type { UiKind } from '@/types/OmikujiData'
  import { getUiSlotsEditor } from '@/editor/ui/uiEditorRegistry'
  import IconRadioGroup from '@/editor/parts/IconRadioGroup.vue'

  const { t } = useI18n()

  const props = defineProps<{
    action: ScenarioStepMessageType
  }>()

  const emit = defineEmits<{
    'update:action': [action: ScenarioStepMessageType]
  }>()

  const { data } = storeToRefs(useOmikujiStore())

  const soundEnabled = computed(() => data.value.settings.generator.soundEnabled)

  const slotsEditor = computed(() => getUiSlotsEditor(props.action.uiKey))

  const updateAction = (updates: Partial<ScenarioStepMessageType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const bubbleText = computed<string>({
    get: () => props.action.message ?? '',
    set: (value) => updateAction({ message: value }),
  })

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
