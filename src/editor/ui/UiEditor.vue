<!-- src/editor/ui/UiEditor.vue -->
<template>
  <!-- セクションのタブ(登録済みの UI から作る) -->
  <SectionTabs :tabs="tabs" />

  <!-- 開発時のみ: UI の有効/無効・レイアウト切り替え -->
  <template v-if="isDev">
    <SectionCard
      sectionKey="dev"
      variant="warning"
      icon="LayoutGrid"
      :label="t('uiSettings.editorSections.layout.label')"
      :description="t('uiSettings.editorSections.layout.description')"
    >
      <!-- レイアウト -->
      <LayoutEditor />
    </SectionCard>

    <SectionCard
      sectionKey="dev"
      variant="warning"
      icon="Trash2"
      :label="t('uiSettings.editorSections.unused.label')"
      :description="t('uiSettings.editorSections.unused.description')"
    >
      <UnusedUiSettingsEditor />
    </SectionCard>
  </template>

  <!-- 各 UI の設定（選択中レイアウトが使う UI のうち、main.ts で登録されたもの） -->
  <template v-for="{ kind, entry } in visibleUiKinds" :key="kind">
    <SectionCard
      :sectionKey="kind"
      :icon="entry.icon"
      :label="t(`mapText.uiKind.${kind}.label`)"
      :description="t(`mapText.uiKind.${kind}.description`)"
    >
      <component :is="entry.component" />
    </SectionCard>
  </template>

  <!-- 共通設定（レイアウトの有無に関わらず常に表示） -->
  <SectionCard
    sectionKey="commonStyle"
    icon="Palette"
    :label="t('uiSettings.editorSections.common.label')"
    :description="t('uiSettings.editorSections.common.description')"
  >
    <FontFamilyEditor />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { isDev } from '@/types/env'
  import type { ContentTab } from '@/editor/types/apps'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import SectionTabs from '@/editor/parts/SectionTabs.vue'
  import { useVisibleUiKinds } from './useVisibleUiKinds'
  import LayoutEditor from './conditions/LayoutEditor.vue'
  import FontFamilyEditor from './common/FontFamilyEditor.vue'
  import UnusedUiSettingsEditor from './conditions/UnusedUiSettingsEditor.vue'

  const { t } = useI18n()

  // 選択中レイアウトが使う UI のうち、main.ts で登録済みのものだけ表示
  const visibleUiKinds = useVisibleUiKinds()

  // タブ(左から 開発時のみ dev → 各 UI → 共通設定)。section は上の SectionCard の sectionKey と一致させる
  const tabs = computed<ContentTab[]>(() => {
    const devTab: ContentTab[] = isDev
      ? [{ section: 'dev', icon: 'LayoutGrid', labelKey: 'shell.contentTabs.dev' }]
      : []
    const kindTabs = visibleUiKinds.value.map(({ kind, entry }): ContentTab => ({
      section: kind,
      icon: entry.icon,
      labelKey: `mapText.uiKind.${kind}.label`,
    }))
    const commonTab: ContentTab = {
      section: 'commonStyle',
      icon: 'Palette',
      labelKey: 'uiSettings.editorSections.common.label',
    }
    return [...devTab, ...kindTabs, commonTab]
  })
</script>
