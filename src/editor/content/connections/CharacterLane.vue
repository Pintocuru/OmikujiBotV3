<!-- src/editor/content/connections/CharacterLane.vue -->
<!-- キャラクター: このキャラクターが使われるイベント(親) → 現在のキャラクター(自分)。子はなし -->
<template>
  <LaneLayout :upstreamLabel="t('connections.characterEvents')">
    <template #upstream>
      <LinkGroup :items="eventItems" :emptyText="t('connections.noCharacterEvents')">
        <p class="text-[0.7rem] opacity-60 mt-1">{{ t('connections.characterEventsHint') }}</p>
      </LinkGroup>
    </template>
  </LaneLayout>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useReferenceGraph } from '@/editor/helpers/referenceGraph/useReferenceGraph'
  import { useLaneItems } from '../composables/useLaneItems'
  import LaneLayout from './LaneLayout.vue'
  import LinkGroup from '@/editor/helpers/referenceGraph/LinkGroup.vue'

  const { t } = useI18n()
  const { eventsUsingCharacter } = useReferenceGraph()

  const eventItems = useLaneItems(eventsUsingCharacter)
</script>
