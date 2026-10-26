<!-- src/editor/apps/appInfo/AppInfoEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- アプリ設定 -->
    <SectionCard
      id="section-appSettings"
      icon="Settings"
      :label="t('appInfoEditor.appSettings.title')"
      :description="t('appInfoEditor.appSettings.description')"
    >
      <GeneratorSettingsEditor />
      <EditorSettingsEditor />
    </SectionCard>

    <!-- 利用可能な機能(登録済みのUI・レイアウト・ゲームスクリプト) -->
    <SectionCard
      id="section-appFeatures"
      icon="Sparkles"
      :label="t('appInfoEditor.appFeatures.title')"
      :description="t('appInfoEditor.appFeatures.description')"
    >
      <AvailableFeaturesInfo />
    </SectionCard>

    <!-- meta:基本情報 -->
    <SectionCard
      id="section-packageBasic"
      icon="Info"
      variant="neutral"
      :label="t('appInfoEditor.packageBasic.title')"
      :description="t('appInfoEditor.packageBasic.description')"
    >
      <PackageBasicInfo />
    </SectionCard>

    <!-- meta:配布情報 -->
    <SectionCard
      id="section-packageDistribution"
      icon="Package"
      variant="neutral"
      :label="t('appInfoEditor.packageDistribution.title')"
      :description="t('appInfoEditor.packageDistribution.description')"
    >
      <PackageDistributionInfo />
    </SectionCard>

    <!-- meta:システム情報 -->
    <SectionCard
      id="section-packageSystem"
      icon="Cpu"
      variant="neutral"
      :label="t('appInfoEditor.packageSystem.title')"
      :description="t('appInfoEditor.packageSystem.description')"
    >
      <PackageSystemInfo />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import GeneratorSettingsEditor from './settings/GeneratorSettingsEditor.vue'
  import EditorSettingsEditor from './settings/EditorSettingsEditor.vue'
  import AvailableFeaturesInfo from './AvailableFeatures/AvailableFeaturesInfo.vue'
  import PackageBasicInfo from './meta/PackageBasicInfo.vue'
  import PackageDistributionInfo from './meta/PackageDistributionInfo.vue'
  import PackageSystemInfo from './meta/PackageSystemInfo.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'

  const { t } = useI18n()
</script>
