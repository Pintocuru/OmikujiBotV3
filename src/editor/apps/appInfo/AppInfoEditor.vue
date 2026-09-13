<!-- src/editor/events/appInfo/AppInfoEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- アプリ設定 -->
    <SectionCard
      id="section-appSettings"
      icon="Settings"
      :isOpen="true"
      :title="t('appInfoEditor.appSettings.title')"
      :description="t('appInfoEditor.appSettings.description')"
    >
      <GeneratorSettingsEditor />
      <EditorSettingsEditor />
    </SectionCard>

    <!-- 実績 -->
    <SectionCard
      id="section-appFeatures"
      icon="Sparkles"
      :isOpen="true"
      :title="t('appInfoEditor.appFeatures.title')"
      :description="t('appInfoEditor.appFeatures.description')"
    >
      <FlagsInfo v-if="!isDev" />
      <FlagsSettings v-else />
    </SectionCard>

    <!-- meta:基本情報 -->
    <SectionCard
      id="section-packageBasic"
      icon="Info"
      variant="neutral"
      :isOpen="true"
      :title="t('appInfoEditor.packageBasic.title')"
      :description="t('appInfoEditor.packageBasic.description')"
    >
      <PackageBasicInfo />
    </SectionCard>

    <!-- meta:配布情報 -->
    <SectionCard
      id="section-packageDistribution"
      icon="Package"
      variant="neutral"
      :isOpen="true"
      :title="t('appInfoEditor.packageDistribution.title')"
      :description="t('appInfoEditor.packageDistribution.description')"
    >
      <PackageDistributionInfo />
    </SectionCard>

    <!-- meta:システム情報 -->
    <SectionCard
      id="section-packageSystem"
      icon="Cpu"
      variant="neutral"
      :isOpen="true"
      :title="t('appInfoEditor.packageSystem.title')"
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
  import FlagsInfo from './FlagsInfo/FlagsInfo.vue'
  import FlagsSettings from './FlagsSettings/FlagsSettings.vue'
  import PackageBasicInfo from './meta/PackageBasicInfo.vue'
  import PackageDistributionInfo from './meta/PackageDistributionInfo.vue'
  import PackageSystemInfo from './meta/PackageSystemInfo.vue'
  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { isDev } from '@/types'

  const { t } = useI18n()
</script>
