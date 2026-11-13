<!-- src/editor/ui/UiEditor.vue -->
<template>
  <!-- セクションのタブ。スクロールしても隠れないよう上に貼り付ける(左右は外枠 SectionCard の p-4 の分だけ広げる) -->
  <div class="flex-wrap top-0 z-10 -mx-4 bg-base-200 px-4 py-2">
    <IconRadioGroup
      v-model="selectedSection"
      i18n-prefix="sectionTabs"
      :icons="tabIcons"
      :keys="tabSections"
      :i18n-base-of="i18nBaseOf"
      :compactThreshold="20"
    />
  </div>

  <!-- 各セクションのカード -->
  <SubSection
    v-for="sec in sections"
    :key="sec.section"
    :section-key="sec.section"
    :icon="sec.icon"
    :variant="sec.variant"
    :title-key="sec.labelKey"
    :description-key="sec.descriptionKey"
  >
    <component :is="sec.component" />
  </SubSection>
</template>

<script setup lang="ts">
  import { computed, markRaw, type Component } from 'vue'
  import { isDev } from '@/common/AppEnv'
  import type { ContentTab } from '@/editor/types/apps'
  import SubSection from '@/editor/parts/SubSection.vue'
  import IconRadioGroup from '@/editor/parts/IconRadioGroup.vue'
  import { useSectionTabs } from '@/editor/parts/composables/useSectionTabs'
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

  const { selectedSection, tabSections, tabIcons, i18nBaseOf } = useSectionTabs(tabs)
</script>
