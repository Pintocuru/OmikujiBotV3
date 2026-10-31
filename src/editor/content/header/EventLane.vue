<!-- src/editor/content/header/EventLane.vue -->
<!-- イベント: 現在のイベント → みくじ箱 → シナリオ -->
<template>
  <div class="flex flex-wrap items-end gap-x-2 gap-y-3">
    <ItemSwitcher />

    <template v-if="box">
      <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
      <LinkGroup :label="t('categories.mikuji.label')" :items="[{ category: 'mikuji', key: box.key, name: box.name || box.key }]">
        <a class="link link-hover text-xs" @click="pickerOpen = true">{{ t('connections.changeBox') }}</a>
      </LinkGroup>

      <template v-if="scenarioItems.length > 0">
        <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
        <LinkGroup :label="t('categories.scenarios.label')" :items="scenarioItems" />
      </template>
    </template>

    <!-- 未接続 / 参照切れ -->
    <template v-else>
      <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
      <div class="flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
        <span v-if="omikujiKey" class="badge badge-warning">{{ t('connections.boxMissing', { key: omikujiKey }) }}</span>
        <span class="text-sm">{{ t('connections.noBoxHint') }}</span>
        <button class="btn btn-xs btn-primary" @click="pickerOpen = true">{{ t('connections.chooseBox') }}</button>
        <button class="btn btn-xs btn-outline btn-primary" @click="createAndConnect">
          {{ t('connections.createBox') }}
        </button>
      </div>
    </template>

    <MikujiPickerDialog v-model:open="pickerOpen" :selectedKey="omikujiKey || undefined" @select="onSelectBox" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ArrowRight } from 'lucide-vue-next'
  import type { EventCategoryType } from '@/types/OmikujiData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useOmikujiConnections } from '../composables/useOmikujiConnections'
  import MikujiPickerDialog from '@/editor/events/core/MikujiPickerDialog.vue'
  import ItemSwitcher from './ItemSwitcher.vue'
  import LinkGroup from './LinkGroup.vue'
  import type { LinkItem } from './types'

  const { t } = useI18n()
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getEvent } = useGetEventData()
  const { getAsset } = useGetAssetData()
  const { updateEvent, addAsset } = useOmikujiStore()
  const { connectedScenarios } = useOmikujiConnections()

  const pickerOpen = ref(false)

  const event = computed(() =>
    selectedItemKey.value ? (getEvent(selectedCategory.value as EventCategoryType, selectedItemKey.value) ?? null) : null
  )
  const omikujiKey = computed(() => event.value?.omikujiKey ?? '')
  const box = computed(() => (omikujiKey.value ? (getAsset('mikuji', omikujiKey.value) ?? null) : null))
  const scenarioItems = computed<LinkItem[]>(() =>
    box.value ? connectedScenarios(box.value.key).map((s) => ({ category: 'scenarios', ...s })) : []
  )

  /** イベントのみくじ箱を切り替える('' で接続解除) */
  const onSelectBox = (key: string) => {
    if (!event.value) return
    updateEvent(selectedCategory.value as EventCategoryType, event.value.id, { omikujiKey: key })
  }

  /** 新しいみくじ箱を作成して、すぐ接続する */
  const createAndConnect = () => onSelectBox(addAsset('mikuji'))
</script>
