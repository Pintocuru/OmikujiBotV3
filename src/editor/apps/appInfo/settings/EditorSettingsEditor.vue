<!-- src/editor/apps/appInfo/settings/EditorSettingsEditor.vue -->
<template>
  <!-- コンフィグエディター設定 -->
  <SubSectionHeader
    icon="Settings"
    title="コンフィグエディター設定"
    description="エディターの見た目・動作・ライセンスなど、アプリ本体の設定"
  />

  <!-- DaisyUIテーマ -->
  <SettingItem v-if="isDev" label="エディターテーマ" description="DaisyUiのカラーテーマを設定します">
    <select
      :value="settings.developer.daisyUiTheme"
      @change="(e) => updateDeveloper('daisyUiTheme', (e.target as HTMLSelectElement).value as ThemeType)"
      class="select select-bordered"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
    <span class="pl-2">
      <button class="btn btn-sm btn-outline" @click="setRandomTheme">ランダム</button>
    </span>
  </SettingItem>

  <!-- 起動時に開くカテゴリ -->
  <SettingItem
    label="起動時に開くカテゴリ"
    description="起動時に最初に開くカテゴリを設定します"
    :showReset="true"
    @reset="resetInitialCategory"
  >
    <select
      :value="settings.editor.initialCategory"
      @change="(e) => updateEditor('initialCategory', (e.target as HTMLSelectElement).value as CategoryType)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(value, key) in categoryMap" :key="key" :value="key">
        {{ value.label }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev, SettingsSchema, themes } from '@/types'
  import type { ThemeType } from '@/types'
  import type { CategoryType, SettingsType } from '@/types/OmikujiData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { categoryMap } from '@/maps/OmikujiData/CategoryMap.js'

  type EditorSettings = SettingsType['editor']
  type DeveloperSettings = SettingsType['developer']

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const settings = computed(() => data.value.settings)

  // editor 配下のフィールドを更新
  const updateEditor = <K extends keyof EditorSettings>(field: K, value: EditorSettings[K]) => {
    omikujiStore.updateSettings({
      editor: { ...settings.value.editor, [field]: value },
    })
  }

  // developer 配下のフィールドを更新
  const updateDeveloper = <K extends keyof DeveloperSettings>(field: K, value: DeveloperSettings[K]) => {
    omikujiStore.updateSettings({
      developer: { ...settings.value.developer, [field]: value },
    })
  }

  const resetInitialCategory = () => {
    const defaults = SettingsSchema.parse({ generator: {}, editor: {}, developer: {} })
    updateEditor('initialCategory', defaults.editor.initialCategory)
  }

  const setRandomTheme = () => {
    if (!themes.length) return
    updateDeveloper('daisyUiTheme', themes[Math.floor(Math.random() * themes.length)])
  }
</script>
