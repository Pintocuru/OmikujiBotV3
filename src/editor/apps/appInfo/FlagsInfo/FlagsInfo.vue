<!-- src/editor/apps/appInfo/FlagsInfo/FlagsInfo.vue -->
<template>
  <div class="space-y-4">
    <!-- アイテム -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SubSectionHeader icon="Box" title="アイテム" description="ジェネレーターで表示できるアイテム" />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <FeatureCard
            v-for="key in components"
            :key="key"
            :title="uiKindMap[key]?.label || key"
            :icon="uiKindMap[key]?.icon || 'Package'"
            :description="uiKindMap[key]?.description || ''"
            :show-toggle="false"
            :is-enabled="true"
          />
        </div>

        <div v-if="components.length === 0" class="text-center py-4 text-base-content/60">
          利用可能なアイテムはありません
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { UiKind } from '@/types/OmikujiData'
  import FeatureCard from './FeatureCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { uiKindMap } from '@/maps/OmikujiData/index'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const components = computed(() =>
    (Object.keys(data.value.ui.settings) as UiKind[]).filter((key) => data.value.ui.settings[key] !== undefined)
  )
</script>
