<!-- src/editor/content/connections/EventLane.vue -->
<!-- イベント: 現在のイベント(自分) → みくじ箱(子)。親はなし。孫にあたるシナリオは出さない(親・自分・子の3点で見る) -->
<template>
  <LaneLayout :downstreamLabel="t('categories.mikuji.label')">
    <template #downstream>
      <!-- みくじ箱の変更ボタン -->
      <div class="tooltip tooltip-bottom" :data-tip="t('connections.changeBox')">
        <button
          class="btn btn-xs btn-ghost btn-square"
          :aria-label="t('connections.changeBox')"
          @click="pickerOpen = true"
        >
          <ArrowLeftRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <LinkGroup v-if="box" :items="boxItems" :loading="false" />

      <!-- 未接続 / 参照切れ -->
      <div v-else class="flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
        <span v-if="omikujiKey" class="badge badge-warning">{{
          t('connections.boxMissing', { key: omikujiKey })
        }}</span>
        <span class="text-sm">{{ t('connections.noBoxHint') }}</span>
        <button class="btn btn-xs btn-primary" @click="pickerOpen = true">{{ t('connections.chooseBox') }}</button>
        <button class="btn btn-xs btn-outline btn-primary" @click="createAndConnect">
          {{ t('connections.createBox') }}
        </button>
      </div>
    </template>

    <MikujiPickerDialog v-model:open="pickerOpen" :selectedKey="omikujiKey || undefined" @select="onSelectBox" />
  </LaneLayout>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ArrowLeftRight } from 'lucide-vue-next'
  import type { EventCategoryType } from '@/types/OmikujiData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import MikujiPickerDialog from './MikujiPickerDialog.vue'
  import LaneLayout from './LaneLayout.vue'
  import LinkGroup from '@/editor/helpers/referenceGraph/LinkGroup.vue'
  import type { LinkItem } from '@/editor/helpers/referenceGraph/types'

  const { t } = useI18n()
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getEvent } = useGetEventData()
  const { getAsset } = useGetAssetData()
  const { updateEvent, addAsset } = useOmikujiStore()

  const pickerOpen = ref(false)

  const event = computed(() =>
    selectedItemKey.value
      ? (getEvent(selectedCategory.value as EventCategoryType, selectedItemKey.value) ?? null)
      : null
  )
  const omikujiKey = computed(() => event.value?.omikujiKey ?? '')
  const box = computed(() => (omikujiKey.value ? (getAsset('mikuji', omikujiKey.value) ?? null) : null))
  const boxItems = computed<LinkItem[]>(() =>
    box.value ? [{ category: 'mikuji', key: box.value.key, name: box.value.name || box.value.key }] : []
  )

  /** イベントのみくじ箱を切り替える('' で接続解除) */
  const onSelectBox = (key: string) => {
    if (!event.value) return
    updateEvent(selectedCategory.value as EventCategoryType, event.value.id, { omikujiKey: key })
  }

  /** 新しいみくじ箱を作成して、すぐ接続する */
  const createAndConnect = () => onSelectBox(addAsset('mikuji'))
</script>
