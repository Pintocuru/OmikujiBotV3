<!-- src/editor/ui/UiEditor.vue -->
<template>
  <!-- セクションのタブ -->
  <SectionTabs :tabs="tabs" />

  <!-- 各セクションのカード -->
  <SectionCard
    v-for="sec in sections"
    :key="sec.section"
    :section-key="sec.section"
    :icon="sec.icon"
    :variant="sec.variant"
    :label-key="sec.labelKey"
    :description-key="sec.descriptionKey"
  >
    <component :is="sec.component" />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, markRaw, type Component } from 'vue'
  import { isDev } from '@/types/env'
  import type { ContentTab } from '@/editor/types/apps'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import SectionTabs from '@/editor/parts/SectionTabs.vue'
  import { useVisibleUiKinds } from './useVisibleUiKinds'
  import LayoutEditor from './conditions/LayoutEditor.vue'
  import FontFamilyEditor from './common/FontFamilyEditor.vue'
  import UnusedUiSettingsEditor from './conditions/UnusedUiSettingsEditor.vue'
  import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
  import { DaisyUIColorType } from '@/types/core'

  type UiEditorSection = {
    section: string
    icon: LucideIconName
    labelKey: string
    descriptionKey?: string
    variant?: DaisyUIColorType
    component: Component
  }

  // 選択中レイアウトが使う UI のうち、main.ts で登録済みのものだけ表示
  const visibleUiKinds = useVisibleUiKinds()

  // セクション定義(表示順)。タブはここから生成する
  const sections = computed<UiEditorSection[]>(() => [
    ...visibleUiKinds.value.map(({ kind, entry }) => ({
      section: kind,
      icon: entry.icon,
      labelKey: `mapText.uiKind.${kind}.label`,
      descriptionKey: `mapText.uiKind.${kind}.description`,
      component: entry.component,
    })),
    {
      section: 'commonStyle',
      icon: 'Palette' as const,
      labelKey: 'uiSettings.editorSections.common.label',
      descriptionKey: 'uiSettings.editorSections.common.description',
      component: markRaw(FontFamilyEditor),
    },
    // 開発時のみ: レイアウト / 未使用UIの整理(タブはまとめて 1 つ)
    ...(isDev
      ? [
          {
            section: 'dev',
            icon: 'LayoutGrid' as const,
            labelKey: 'uiSettings.editorSections.layout.label',
            descriptionKey: 'uiSettings.editorSections.layout.description',
            variant: 'warning' as const,
            component: markRaw(LayoutEditor),
          },
          {
            section: 'dev',
            icon: 'LayoutGrid' as const,
            labelKey: 'shell.contentTabs.dev',
            variant: 'warning' as const,
            component: markRaw(UnusedUiSettingsEditor),
          },
        ]
      : []),
  ])

  // タブ。dev が 2 カードなので section が重複した分は重複排除する
  const tabs = computed<ContentTab[]>(() => {
    const seen = new Set<string>()
    return sections.value
      .filter((sec) => (seen.has(sec.section) ? false : seen.add(sec.section)))
      .map(({ section, icon, labelKey }): ContentTab => ({ section, icon, labelKey }))
  })
</script>
