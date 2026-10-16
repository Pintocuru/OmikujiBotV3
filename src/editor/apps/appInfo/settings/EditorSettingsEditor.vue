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
      @change="(e) => update('developer', { daisyUiTheme: (e.target as HTMLSelectElement).value as ThemeType })"
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
    @reset="reset('editor', 'initialCategory')"
  >
    <select
      :value="settings.editor.initialCategory"
      @change="(e) => update('editor', { initialCategory: (e.target as HTMLSelectElement).value as CategoryType })"
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
  import type { CategoryType } from '@/types/OmikujiData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { categoryMap } from '@/maps/OmikujiData/CategoryMap'
  import { ThemeType, themes } from '@/types/core'
  import { isDev } from '@/types/env'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateSettingsSection: update, resetSettingsField: reset } = omikujiStore

  const settings = computed(() => data.value.settings)

  const setRandomTheme = () => {
    if (!themes.length) return
    update('developer', { daisyUiTheme: themes[Math.floor(Math.random() * themes.length)] })
  }
</script>
