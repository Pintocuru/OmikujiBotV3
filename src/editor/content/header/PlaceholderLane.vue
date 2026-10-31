<!-- src/editor/content/header/PlaceholderLane.vue -->
<!-- プレースホルダー: 使っているシナリオ・上位のプレースホルダー → 現在 → 中で使っているプレースホルダー -->
<template>
  <LaneLayout>
    <template #upstream>
      <LinkGroup
        :label="t('connections.placeholderUsers')"
        :items="upstreamItems"
        :emptyText="t('connections.noPlaceholderUsers')"
      />
    </template>
    <template #downstream>
      <LinkGroup
        :label="t('connections.childPlaceholders')"
        :items="childItems"
        :emptyText="t('connections.noChildPlaceholders')"
      />
    </template>
  </LaneLayout>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useReferenceGraph } from '../composables/useReferenceGraph'
  import LaneLayout from './LaneLayout.vue'
  import LinkGroup from './LinkGroup.vue'
  import type { LinkItem } from './types'

  const { t } = useI18n()
  const { selectedItemKey } = storeToRefs(useNavigationStore())
  const { scenariosOfPlaceholder, parentPlaceholders, childPlaceholders } = useReferenceGraph()

  // 使っている側: 上位のプレースホルダー → シナリオの順
  const upstreamItems = computed<LinkItem[]>(() => {
    const key = selectedItemKey.value
    if (!key) return []
    return [
      ...parentPlaceholders(key).map((p): LinkItem => ({ category: 'placeholders', ...p })),
      ...scenariosOfPlaceholder(key).map((s): LinkItem => ({ category: 'scenarios', ...s })),
    ]
  })

  const childItems = computed<LinkItem[]>(() =>
    selectedItemKey.value
      ? childPlaceholders(selectedItemKey.value).map((p): LinkItem => ({ category: 'placeholders', ...p }))
      : []
  )
</script>
