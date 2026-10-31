<!-- src/editor/content/header/PlaceholderLane.vue -->
<!-- プレースホルダー: 使っているシナリオ・上位のプレースホルダー → 現在 → 中で使っているプレースホルダー -->
<template>
  <div class="flex flex-wrap items-end gap-x-2 gap-y-3">
    <LinkGroup
      :label="t('connections.placeholderUsers')"
      :items="upstreamItems"
      :emptyText="t('connections.noPlaceholderUsers')"
    />
    <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
    <ItemSwitcher />
    <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
    <LinkGroup
      :label="t('connections.childPlaceholders')"
      :items="childItems"
      :emptyText="t('connections.noChildPlaceholders')"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ArrowRight } from 'lucide-vue-next'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useReferenceGraph } from '../composables/useReferenceGraph'
  import ItemSwitcher from './ItemSwitcher.vue'
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
