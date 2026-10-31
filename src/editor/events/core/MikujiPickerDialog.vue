<!-- src/editor/events/core/MikujiPickerDialog.vue -->
<!-- 誤操作防止のため、プルダウンではなくダイアログでみくじ箱を切り替える -->
<template>
  <BaseDialog :open="open" :title="t('connections.picker.title')" size="2xl" @update:open="emit('update:open', $event)">
    <div class="max-h-[55vh] overflow-y-auto space-y-2 py-2">
      <div v-if="boxList.length === 0" class="rounded-lg bg-neutral text-neutral-content p-4 text-sm">
        {{ t('connections.picker.empty') }}
      </div>

      <div
        v-for="box in boxList"
        :key="box.key"
        class="rounded-lg border p-3"
        :class="box.key === selectedKey ? 'border-primary bg-primary/5' : 'border-base-300'"
      >
        <div class="flex items-center gap-2">
          <Package class="w-4 h-4 shrink-0" />
          <span class="font-bold truncate">{{ box.name || box.key }}</span>
        </div>
        <div class="text-xs opacity-60 mt-1 break-all">key: {{ box.key }}</div>
        <div class="text-sm mt-1">{{ box.description || t('connections.picker.noDescription') }}</div>
        <div class="text-xs opacity-60 mt-1">
          {{ t('connections.picker.eventsCount', { count: connectedEvents(box.key).length }) }} /
          {{ t('connections.picker.scenariosCount', { count: connectedScenarios(box.key).length }) }}
        </div>
        <div class="flex gap-2 mt-2">
          <button class="btn btn-xs btn-primary" @click="handleSelect(box.key)">
            {{ t('connections.picker.select') }}
          </button>
          <button class="btn btn-xs btn-ghost" @click="goToBox(box.key)">
            {{ t('connections.picker.edit') }}
          </button>
        </div>
      </div>
    </div>

    <template #actions>
      <button v-if="selectedKey" class="btn btn-sm btn-ghost" @click="handleSelect('')">
        {{ t('connections.picker.unlink') }}
      </button>
      <button class="btn btn-sm btn-primary" @click="createAndSelect">
        {{ t('connections.picker.create') }}
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Package } from 'lucide-vue-next'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useOmikujiConnections } from '@/editor/content/composables/useOmikujiConnections'

  const { t } = useI18n()

  defineProps<{
    open: boolean
    selectedKey?: string
  }>()

  const emit = defineEmits<{
    select: [key: string]
    'update:open': [open: boolean]
  }>()

  const { addAsset } = useOmikujiStore()
  const { getAssets } = useGetAssetData()
  const navigationStore = useNavigationStore()
  const { connectedEvents, connectedScenarios } = useOmikujiConnections()

  const boxList = computed(() => Object.values(getAssets('mikuji')).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))

  const close = () => emit('update:open', false)

  const handleSelect = (key: string) => {
    emit('select', key)
    close()
  }

  /** 新しいみくじ箱を作成して、すぐ接続する */
  const createAndSelect = () => {
    const key = addAsset('mikuji')
    emit('select', key)
    close()
  }

  /** 名前・説明変更のため、該当するみくじ箱へ飛ぶ */
  const goToBox = (key: string) => {
    close()
    navigationStore.selectCategory('mikuji')
    navigationStore.selectItem(key)
  }
</script>
