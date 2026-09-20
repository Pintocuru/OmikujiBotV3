<!-- src/editor/assets/characters/service/CommentVoiceSettings.vue -->
<template>
  <!-- mode  -->
  <SettingItem label="BOTコメント表現方法" description="BOTの文章を表現する方法を指定します">
    <select
      v-model="currentDisplayOption.mode"
      @change="updateDisplayField('mode', ($event.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(value, key) in displayModeMap" :key="key" :value="key">
        {{ value }}
      </option>
    </select>
  </SettingItem>

  <template v-if="currentDisplayOption.mode === 'comment'">
    <!-- 補足説明 -->
    <InformationCard>
      キャラクター専用の枠を作成すると、各キャラクターごとに
      <code class="label bg-accent text-accent-content">「読み上げ」設定</code>を個別に行うことができます。<br />
      詳しくは
      <a
        href="https://onecomme.com/docs/guide/speech"
        target="_blank"
        rel="noopener"
        class="inline-block px-2 py-1 rounded bg-secondary text-secondary-content hover:bg-secondary/70 transition"
      >
        読み上げ機能を使う
      </a>
      をお読みください。
    </InformationCard>

    <!-- わんコメの枠を指定 -->
    <SettingItem label="枠のID名" description="空白なら、わんコメの一番上の枠を使用します">
      <input type="text" class="input w-full" v-model="currentDisplayOption.frameId" />
    </SettingItem>

    <!-- imageBase64 -->
    <CharacterBase64Settings
      :modelValue="currentDisplayOption"
      :backgroundColor="backgroundColor"
      :onUpdate="props.onUpdate"
    />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { DisplayOptionType } from '@/types/'
  import CharacterBase64Settings from './CharacterBase64Settings.vue'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import InformationCard from '@/editor/parts/InformationCard/InformationCard.vue'
  import { displayModeMap } from '@/maps/OmikujiData/index.js'

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
