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
      @change="(e) => updateField('daisyUiTheme', (e.target as HTMLSelectElement).value)"
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
    @reset="resetMap.initialCategory"
    forceMode="god"
  >
    <select
      :value="settings.editor.initialCategory"
      @change="(e) => updateField('initialCategory', (e.target as HTMLSelectElement).value)"
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
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import type { SettingsType } from '@/types/OmikujiData/SettingsSchema'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { categoryMap } from '@/maps/OmikujiData/CategoryMap.js'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const settings = computed(() => data.value.settings)

  const updateField = <K extends keyof SettingsType>(field: K, value: any) => {
    omikujiStore.updateSettings({ [field]: value })
  }

  const resetField = (field: keyof typeof settings.value) => {
    const defaults = SettingsSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    initialCategory: () => resetField('initialCategory'),
  }

  const setRandomTheme = () => {
    if (!themes.length) return
    const random = themes[Math.floor(Math.random() * themes.length)]
    updateField('daisyUiTheme', random)
  }
</script>
