<!-- src/editor/apps/appInfo/AvailableFeatures/AvailableFeaturesInfo.vue -->
<template>
  <div class="space-y-4">
    <div v-for="section in sections" :key="section.id" class="card shadow-lg">
      <SubSectionHeader
        :icon="section.icon"
        :title="t(`appInfoEditor.features.${section.id}.title`)"
        :description="t(`appInfoEditor.features.${section.id}.description`)"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FeatureCard
          v-for="item in section.items"
          :key="item.key"
          :title="item.title"
          :icon="item.icon"
          :description="item.description"
          :show-toggle="false"
          :is-enabled="true"
        />
      </div>

      <div v-if="section.items.length === 0" class="text-center py-4 text-base-content/60">
        {{ t(`appInfoEditor.features.${section.id}.empty`) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import FeatureCard from './FeatureCard.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
  import { getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'
  import { gameMetaMap, uiKindMap, uiLayoutMap } from '@/maps/OmikujiData'
  import { uiLayouts, type UiKind } from '@/types/OmikujiData'
  import { getLayoutLoader, getUiLoader } from '@/ui/uiRegistry'

  type FeatureItem = { key: string; title: string; icon: LucideIconName; description: string }
  type FeatureSection = { id: 'ui' | 'layout' | 'gameScript'; icon: LucideIconName; items: FeatureItem[] }

  const { t } = useI18n()

  // main.ts(registerAll)で登録済みのものだけを表示する
  const uiItems = computed<FeatureItem[]>(() =>
    (Object.keys(uiKindMap) as UiKind[])
      .filter((kind) => getUiLoader(kind))
      .map((kind) => ({
        key: kind,
        title: uiKindMap[kind].label,
        icon: uiKindMap[kind].icon,
        description: uiKindMap[kind].description,
      }))
  )

  const layoutItems = computed<FeatureItem[]>(() =>
    uiLayouts
      .filter((key) => getLayoutLoader(key))
      .map((key) => ({
        key,
        title: uiLayoutMap[key].label,
        icon: 'LayoutGrid',
        description: uiLayoutMap[key].description,
      }))
  )

  const gameScriptItems = computed<FeatureItem[]>(() =>
    getRegisteredGameScriptKeys().map((key) => ({
      key,
      title: gameMetaMap[key].name,
      icon: gameMetaMap[key].icon as LucideIconName,
      description: gameMetaMap[key].description,
    }))
  )

  const sections = computed<FeatureSection[]>(() => [
    { id: 'layout', icon: 'LayoutGrid', items: layoutItems.value },
    { id: 'ui', icon: 'Box', items: uiItems.value },
    { id: 'gameScript', icon: 'Gamepad2', items: gameScriptItems.value },
  ])
</script>
