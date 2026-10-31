<!-- src/editor/content/header/CharacterLane.vue -->
<!-- キャラクター: このキャラクターが使われるイベント → 現在のキャラクター -->
<template>
  <div class="flex flex-wrap items-end gap-x-2 gap-y-3">
    <LinkGroup
      :label="t('connections.characterEvents')"
      :items="eventItems"
      :emptyText="t('connections.noCharacterEvents')"
    >
      <p class="text-[0.7rem] opacity-60 mt-1">{{ t('connections.characterEventsHint') }}</p>
    </LinkGroup>
    <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
    <ItemSwitcher />
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
  const { eventsUsingCharacter } = useReferenceGraph()

  const eventItems = computed<LinkItem[]>(() =>
    selectedItemKey.value
      ? eventsUsingCharacter(selectedItemKey.value).map((e) => ({ category: e.category, key: e.id, name: e.name }))
      : []
  )
</script>
