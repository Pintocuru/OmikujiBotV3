<!-- src/editor/ui/UiEditor.vue -->
<template>
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
  import { useI18n } from 'vue-i18n'
  import { isDev } from '@/types/env'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useVisibleUiKinds } from './useVisibleUiKinds'
  import LayoutEditor from './conditions/LayoutEditor.vue'
  import FontFamilyEditor from './common/FontFamilyEditor.vue'
  import UnusedUiSettingsEditor from './conditions/UnusedUiSettingsEditor.vue'

  const { t } = useI18n()

  // 選択中レイアウトが使う UI のうち、main.ts で登録済みのものだけ表示
  const visibleUiKinds = useVisibleUiKinds()
</script>
