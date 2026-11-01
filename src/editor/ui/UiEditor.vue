<!-- src/editor/ui/UiEditor.vue -->
<template>
  <!-- 開発時のみ: UI の有効/無効・レイアウト切り替え -->
  <template v-if="isDev">
    <SectionCard
      sectionKey="dev"
      variant="warning"
      icon="LayoutGrid"
      label="レイアウト"
      description="ジェネレーターで使用するレイアウトの切り替え"
    >
      <!-- レイアウト -->
      <LayoutEditor />
    </SectionCard>

    <SectionCard
      sectionKey="dev"
      variant="warning"
      icon="Trash2"
      label="未使用UIの整理"
      description="リリース前に不要な UI 設定を削除"
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
    label="共通設定"
    description="フォントなど、すべての表示に共通する設定"
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
