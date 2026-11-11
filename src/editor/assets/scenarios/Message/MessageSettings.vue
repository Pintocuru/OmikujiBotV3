<!-- src/editor/assets/scenarios/Message/MessageSettings.vue -->
<template>
  <!-- bubble を使う UI: キャラ・アイコン・本文 -->
  <template v-if="spec.bubble">
    <!-- キャラクター選択 -->
    <SettingItem layout="vertical" icon="User" labelKey="scenarioStep.common.character">
      <CharacterIconPicker :character-key="step.characterKey ?? ''" :icon-key="step.iconKey" @select="updateStep" />
    </SettingItem>

    <!-- メッセージ -->
    <SettingItem
      v-if="spec.bubble === 'comment'"
      icon="MessageSquare"
      layout="vertical"
      labelKey="scenarioStep.messageSettings.message"
    >
      <MessageTextDialog v-model="bubbleText" />
    </SettingItem>
  </template>

  <!-- UI ごとの slots (UiMessageSpecs の map から入力欄を作る) -->
  <component v-if="slotsEditor" :is="slotsEditor" :slots="step.slots" @update:slots="updateStep({ slots: $event })" />
  <SettingItem
    v-else-if="slotMetas.length > 0"
    icon="MessageSquare"
    layout="vertical"
    labelKey="scenarioStep.messageSettings.slots"
  >
    <div v-for="meta in slotMetas" :key="meta.slot" class="mb-2">
      <p class="mb-1 text-sm font-medium">
        {{ t(`uiSettings.slots.${step.uiKey}.${meta.key}.title`) }}
        <span class="ml-2 text-xs opacity-60">
          {{ t(`uiSettings.slots.${step.uiKey}.${meta.key}.description`) }}
        </span>
      </p>

      <input
        type="text"
        class="input input-bordered input-sm w-full"
        :value="step.slots[meta.slot] ?? ''"
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
    :step="step"
    @update:step="emit('update:step', $event as ScenarioStepMessageType)"
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import CharacterIconPicker from '@/editor/parts/CharacterPicker/CharacterIconPicker.vue'
  import { ScenarioStepMessageType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from '@/editor/parts/MessageTextDialog/MessageTextDialog.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SoundSettings from '../Sounds/SoundSettings.vue'
  import { getUiMessageSpec } from '@/types/generator'
  import { getUiSlotsEditor } from '@/editor/ui/uiEditorRegistry'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepMessageType
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepMessageType]
  }>()

  const { data } = storeToRefs(useOmikujiStore())
  const soundEnabled = computed(() => data.value.settings.generator.soundEnabled)
  const slotsEditor = computed(() => getUiSlotsEditor(props.step.uiKey))
  // 表示先の UI
  const spec = computed(() => getUiMessageSpec(props.step.uiKey))
  const slotMetas = computed(() => Object.entries(spec.value.slots).map(([key, meta]) => ({ key, slot: meta.slot })))

  const updateStep = (updates: Partial<ScenarioStepMessageType>) => {
    emit('update:step', { ...props.step, ...updates })
  }

  const bubbleText = computed<string>({
    get: () => props.step.message ?? '',
    set: (value) => updateStep({ message: value }),
  })

  const updateSlot = (slot: string, value: string) => {
    updateStep({ slots: { ...props.step.slots, [slot]: value } })
  }
</script>
