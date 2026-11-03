<!-- src/editor/apps/appInfo/AppInfoEditor.vue -->
<template>
  <!-- セクションのタブ -->
  <SectionTabs :tabs="tabs" />

  <div class="space-y-4">
    <!-- アプリ設定 -->
    <SectionCard
      sectionKey="appSettings"
      icon="Settings"
      label-key="appInfoEditor.appSettings.label"
      description-key="appInfoEditor.appSettings.description"
    >
      <GeneratorSettingsEditor />
      <EditorSettingsEditor />
    </SectionCard>

    <!-- 利用可能な機能(登録済みのUI・レイアウト・ゲームスクリプト) -->
    <SectionCard
      sectionKey="appFeatures"
      icon="Sparkles"
      label-key="appInfoEditor.appFeatures.label"
      description-key="appInfoEditor.appFeatures.description"
    >
      <AvailableFeaturesInfo />
    </SectionCard>

    <!-- meta:基本情報 -->
    <SectionCard
      sectionKey="packageBasic"
      icon="Info"
      variant="neutral"
      label-key="appInfoEditor.packageBasic.label"
      description-key="appInfoEditor.packageBasic.description"
    >
      <PackageBasicInfo />
    </SectionCard>

    <!-- meta:配布情報 -->
    <SectionCard
      sectionKey="packageDistribution"
      icon="Package"
      variant="neutral"
      label-key="appInfoEditor.packageDistribution.label"
      description-key="appInfoEditor.packageDistribution.description"
    >
      <PackageDistributionInfo />
    </SectionCard>

    <!-- meta:システム情報 -->
    <SectionCard
      sectionKey="packageSystem"
      icon="Cpu"
      variant="neutral"
      label-key="appInfoEditor.packageSystem.label"
      description-key="appInfoEditor.packageSystem.description"
    >
      <PackageSystemInfo />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import type { ContentTab } from '@/editor/types/apps'
  import GeneratorSettingsEditor from './settings/GeneratorSettingsEditor.vue'
  import EditorSettingsEditor from './settings/EditorSettingsEditor.vue'
  import AvailableFeaturesInfo from './AvailableFeatures/AvailableFeaturesInfo.vue'
  import PackageBasicInfo from './meta/PackageBasicInfo.vue'
  import PackageDistributionInfo from './meta/PackageDistributionInfo.vue'
  import PackageSystemInfo from './meta/PackageSystemInfo.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import SectionTabs from '@/editor/parts/SectionTabs.vue'

  // タブ(左から)。section は上の SectionCard の sectionKey と一致させる
  const tabs: ContentTab[] = [
    { section: 'appSettings', icon: 'Settings', labelKey: 'appInfoEditor.appSettings.label' },
    { section: 'appFeatures', icon: 'Sparkles', labelKey: 'appInfoEditor.appFeatures.label' },
    { section: 'packageBasic', icon: 'Info', labelKey: 'appInfoEditor.packageBasic.label' },
    { section: 'packageDistribution', icon: 'Package', labelKey: 'appInfoEditor.packageDistribution.label' },
    { section: 'packageSystem', icon: 'Cpu', labelKey: 'appInfoEditor.packageSystem.label' },
  ]
</script>
