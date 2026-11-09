<!-- src/editor/apps/appInfo/AppInfoEditor.vue -->
<template>
  <SectionTabs :tabs="tabs" />

  <div class="space-y-4">
    <SubSection
      v-for="sec in sections"
      :key="sec.section"
      :section-key="sec.section"
      :icon="sec.icon"
      :title-key="sec.labelKey"
      :description-key="sec.descriptionKey"
      :variant="sec.variant"
    >
      <template v-for="(child, i) in sec.components" :key="i">
        <component :is="child" />
      </template>
    </SubSection>
  </div>
</template>

<script setup lang="ts">
  import type { Component } from 'vue'
  import { markRaw } from 'vue'
  import type { ContentTab } from '@/editor/types/apps'
  import GeneratorSettingsEditor from './settings/GeneratorSettingsEditor.vue'
  import EditorSettingsEditor from './settings/EditorSettingsEditor.vue'
  import AvailableFeaturesInfo from './AvailableFeatures/AvailableFeaturesInfo.vue'
  import PackageBasicInfo from './meta/PackageBasicInfo.vue'
  import PackageDistributionInfo from './meta/PackageDistributionInfo.vue'
  import PackageSystemInfo from './meta/PackageSystemInfo.vue'
  import SubSection from '@/editor/parts/SubSection.vue'
  import SectionTabs from '@/editor/parts/SectionTabs.vue'
  import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

  type AppInfoSection = {
    section: string
    icon: LucideIconName
    labelKey: string
    descriptionKey: string
    variant?: 'neutral'
    components: Component[]
  }

  // カードの表示順
  const sections: AppInfoSection[] = [
    {
      section: 'appSettings',
      icon: 'Settings',
      labelKey: 'appInfoEditor.appSettings.label',
      descriptionKey: 'appInfoEditor.appSettings.description',
      components: [markRaw(EditorSettingsEditor), markRaw(GeneratorSettingsEditor)],
    },
    {
      section: 'appFeatures',
      icon: 'Sparkles',
      labelKey: 'appInfoEditor.appFeatures.label',
      descriptionKey: 'appInfoEditor.appFeatures.description',
      components: [markRaw(AvailableFeaturesInfo)],
    },
    {
      section: 'packageBasic',
      icon: 'Info',
      labelKey: 'appInfoEditor.packageBasic.label',
      descriptionKey: 'appInfoEditor.packageBasic.description',
      variant: 'neutral',
      components: [markRaw(PackageBasicInfo)],
    },
    {
      section: 'packageDistribution',
      icon: 'Package',
      labelKey: 'appInfoEditor.packageDistribution.label',
      descriptionKey: 'appInfoEditor.packageDistribution.description',
      variant: 'neutral',
      components: [markRaw(PackageDistributionInfo)],
    },
    {
      section: 'packageSystem',
      icon: 'Cpu',
      labelKey: 'appInfoEditor.packageSystem.label',
      descriptionKey: 'appInfoEditor.packageSystem.description',
      variant: 'neutral',
      components: [markRaw(PackageSystemInfo)],
    },
  ]

  const tabs: ContentTab[] = sections.map(({ section, icon, labelKey }) => ({ section, icon, labelKey }))
</script>
