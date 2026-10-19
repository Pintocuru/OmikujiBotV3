<!-- src/editor/apps/appInfo/settings/EditorSettingsEditor.vue -->
<template>
  <!-- コンフィグエディター設定 -->
  <SubSectionHeader
    icon="Settings"
    :title="t('appInfoEditor.settings.editor.title')"
    :description="t('appInfoEditor.settings.editor.description')"
  />

  <!-- DaisyUIテーマ -->
  <SettingItem
    icon="Palette"
    v-if="isDev"
    variant="warning"
    :label="t('appInfoEditor.settings.editor.theme.label')"
    :description="t('appInfoEditor.settings.editor.theme.description')"
    :showReset="true"
    @reset="reset('developer', 'daisyUiTheme')"
  >
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
      <button class="btn btn-sm btn-outline" @click="setRandomTheme">
        {{ t('appInfoEditor.settings.editor.theme.random') }}
      </button>
    </span>
  </SettingItem>

  <!-- 言語設定 -->
  <SettingItem
    icon="Languages"
    :label="t('appInfoEditor.settings.editor.locale.label')"
    :description="t('appInfoEditor.settings.editor.locale.description')"
    :showReset="true"
    @reset="reset('editor', 'locale')"
  >
    <select
      :value="settings.editor.locale"
      @change="(e) => update('editor', { locale: (e.target as HTMLSelectElement).value as LocaleType })"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="locale in locales" :key="locale" :value="locale">
        {{ localeLabels[locale] }}
      </option>
    </select>
  </SettingItem>

  <!-- 起動時に開くカテゴリ -->
  <SettingItem
    icon="LayoutGrid"
    :label="t('appInfoEditor.settings.editor.initialCategory.label')"
    :description="t('appInfoEditor.settings.editor.initialCategory.description')"
    :showReset="true"
    @reset="reset('editor', 'initialCategory')"
  >
    <select
      :value="settings.editor.initialCategory"
      @change="(e) => update('editor', { initialCategory: (e.target as HTMLSelectElement).value as InitialCategoryType })"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="key in initialCategories" :key="key" :value="key">
        {{ categoryMap[key].label }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { initialCategories, locales, type InitialCategoryType, type LocaleType } from '@/types/OmikujiData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { categoryMap } from '@/maps/OmikujiData/CategoryMap'
  import { ThemeType, themes } from '@/types/core'
  import { isDev } from '@/types/env'

  const { t } = useI18n()
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateSettingsSection: update, resetSettingsField: reset } = omikujiStore

  const settings = computed(() => data.value.settings)

  // 言語の表示名(各言語の自称で表記)
  const localeLabels: Record<LocaleType, string> = {
    ja: '日本語',
    en: 'English',
  }

  const setRandomTheme = () => {
    if (!themes.length) return
    update('developer', { daisyUiTheme: themes[Math.floor(Math.random() * themes.length)] })
  }
</script>
