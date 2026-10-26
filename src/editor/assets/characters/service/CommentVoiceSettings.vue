<!-- src/editor/assets/characters/service/CommentVoiceSettings.vue -->
<template>
  <!-- mode  -->
  <SettingItem icon="Megaphone" :label="t('characterService.voice.label')" :description="t('characterService.voice.desc')">
    <select
      :value="currentDisplayOption.mode"
      @change="updateDisplayField('mode', ($event.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(_, key) in displayModeMap" :key="key" :value="key">
        {{ t(`mapText.displayMode.${key}.label`) }}
      </option>
    </select>
  </SettingItem>

  <template v-if="currentDisplayOption.mode === 'comment'">
    <!-- 補足説明 -->
    <InformationCard>
      {{ t('characterService.voice.note1') }}
      <code class="label bg-accent text-accent-content">{{ t('characterService.voice.noteCode') }}</code
      >{{ t('characterService.voice.note2') }}<br />
      {{ t('characterService.voice.seeAlso') }}
      <a
        href="https://onecomme.com/docs/guide/speech"
        target="_blank"
        rel="noopener"
        class="inline-block px-2 py-1 rounded bg-secondary text-secondary-content hover:bg-secondary/70 transition"
      >
        {{ t('characterService.voice.link') }}
      </a>
      {{ t('characterService.voice.readIt') }}
    </InformationCard>

    <!-- わんコメの枠を指定 -->
    <SettingItem icon="Hash" :label="t('characterService.voice.frameLabel')" :description="t('characterService.voice.frameDesc')">
      <input
        type="text"
        class="input w-full"
        :value="currentDisplayOption.frameId"
        @input="updateDisplayField('frameId', ($event.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <!-- imageBase64 -->
    <CharacterBase64Settings
      :modelValue="currentDisplayOption"
      :backgroundColor="backgroundColor"
      :onUpdate="props.onUpdate"
    />
  </template>

  <template v-else-if="currentDisplayOption.mode === 'voice'">
    <!-- 補足説明 -->
    <InformationCard>
      {{ t('characterService.voice.voiceNote1') }}<br />
      {{ t('characterService.voice.voiceNote2') }}
    </InformationCard>
  </template>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { DisplayOptionType } from '@/types/OmikujiData'
  import CharacterBase64Settings from './CharacterBase64Settings.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import { displayModeMap } from '@/maps/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: DisplayOptionType
    backgroundColor?: string
    onUpdate: (value: DisplayOptionType) => void
  }>()

  const currentDisplayOption = computed(() => props.modelValue)

  const updateDisplayField = (key: keyof DisplayOptionType, value: any) => {
    props.onUpdate({ ...currentDisplayOption.value, [key]: value })
  }
</script>
