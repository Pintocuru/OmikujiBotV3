<!-- src/editor/assets/PostFlow/Message/MessageSettings.vue -->
<template>
  <!-- 表示先のUI UIごとに下のフォームが変わる -->
  <SettingItem layout="vertical" :icon="uiKindMap[action.uiKey].icon" :label="t('postFlow.messageSettings.uiKey')">
    <!-- CharacterPicker 同様に role="radiogroup" を使ったアイコン＋名前の選択式 -->
    <div class="flex flex-wrap gap-2" role="radiogroup">
      <button
        v-for="kind in selectableKinds"
        :key="kind"
        type="button"
        role="radio"
        :aria-checked="uiKey === kind"
        class="flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition cursor-pointer"
        :class="[uiKey === kind ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50']"
        @click="uiKey = kind"
      >
        <!-- アイコン表示用ラッパー (サイズを固定して中央寄せ) -->
        <div class="flex items-center justify-center w-8 h-8">
          <component :is="resolveLucideIcon(uiKindMap[kind].icon)" class="w-5 h-5" />
        </div>
        <!-- 名前表示 (class は text-xs の大きさ) -->
        <span class="text-xs truncate max-w-20" :title="uiKindMap[kind].label">
          {{ uiKindMap[kind].label }}
        </span>
      </button>
    </div>
  </SettingItem>

  <!-- bubble を使う UI: キャラ・アイコン・本文 -->
  <template v-if="spec.bubble">
    <SettingItem layout="vertical" icon="User" :label="t('postFlow.common.character')">
      <CharacterPicker v-model="characterKey" />
    </SettingItem>

    <!-- アイコン -->
    <SettingItem
      v-if="!!action.characterKey"
      icon="Palette"
      layout="vertical"
      :label="t('postFlow.messageSettings.icon')"
    >
      <IconSelector :character-key="characterKey" :icon-key="action.iconKey" @update:icon-key="updateIconKey" />
    </SettingItem>

    <!-- メッセージ -->
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
    :label="t('postFlow.messageSettings.slots')"
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
  import { getUiSlotsEditor } from '@/editor/ui/uiEditorRegistry'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowMessageType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowMessageType]
  }>()

  const { data } = storeToRefs(useOmikujiStore())

  const soundEnabled = computed(() => data.value.settings.generator.soundEnabled)

  const slotsEditor = computed(() => getUiSlotsEditor(props.action.uiKey))

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
