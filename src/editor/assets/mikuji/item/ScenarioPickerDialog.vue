<!-- src/editor/assets/mikuji/item/ScenarioPickerDialog.vue -->
<!-- おみくじが実行するシナリオを選ぶダイアログ。誤操作を防ぐため、プルダウンではなくダイアログで切り替える -->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="close">
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between pb-2">
        <h3 class="text-lg font-bold">{{ t('omikujiItem.scenario.dialog.title') }}</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="close">
          <X :size="16" />
        </button>
      </div>

      <input
        v-if="scenarioList.length > 6"
        v-model="query"
        type="search"
        class="input input-bordered input-sm w-full mb-2"
        :placeholder="t('omikujiItem.scenario.dialog.search')"
      />

      <div class="max-h-[55vh] overflow-y-auto space-y-2 py-2">
        <div
          v-if="filteredList.length === 0"
          class="rounded-lg bg-neutral text-neutral-content p-4 text-sm"
        >
          {{ t('omikujiItem.scenario.dialog.empty') }}
        </div>

        <div
          v-for="scenario in filteredList"
          :key="scenario.key"
          class="rounded-lg border p-3"
          :class="scenario.key === selectedKey ? 'border-primary bg-primary/5' : 'border-base-300'"
        >
          <div class="flex items-center gap-2">
            <Zap class="w-4 h-4 shrink-0" />
            <span class="font-bold truncate">{{ scenario.name || scenario.key }}</span>
            <span class="badge badge-sm badge-ghost ml-auto shrink-0">
              {{ t('omikujiItem.scenario.dialog.steps', { count: scenario.steps.length }) }}
            </span>
          </div>
          <div class="text-xs opacity-60 mt-1 break-all">key: {{ scenario.key }}</div>
          <div class="text-sm mt-1">{{ scenario.description || t('omikujiItem.scenario.dialog.noDescription') }}</div>
          <div class="flex gap-2 mt-2">
            <button class="btn btn-xs btn-primary" @click="handleSelect(scenario.key)">
              {{ t('omikujiItem.scenario.dialog.select') }}
            </button>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button v-if="selectedKey" class="btn btn-sm btn-ghost" @click="handleSelect('')">
          {{ t('omikujiItem.scenario.unlink') }}
        </button>
        <button class="btn btn-sm btn-primary" @click="createAndSelect">
          {{ t('omikujiItem.scenario.create') }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop"><button @click="close">close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { X, Zap } from 'lucide-vue-next'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

  const props = defineProps<{
    open: boolean
    selectedKey?: string
  }>()

  const emit = defineEmits<{
    select: [key: string]
    'update:open': [open: boolean]
  }>()

  const { t } = useI18n()
  const { getAssets } = useGetAssetData()
  const { addAsset } = useOmikujiStore()

  const dialogRef = ref<HTMLDialogElement | null>(null)
  const query = ref('')

  const scenarioList = computed(() =>
    Object.values(getAssets('scenarios')).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )
  const filteredList = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return scenarioList.value
    return scenarioList.value.filter((s) => `${s.name} ${s.key} ${s.description}`.toLowerCase().includes(q))
  })

  watch(
    () => props.open,
    (open) => {
      if (open) {
        query.value = ''
        dialogRef.value?.showModal()
      } else dialogRef.value?.close()
    }
  )

  const close = () => emit('update:open', false)

  const handleSelect = (key: string) => {
    emit('select', key)
    close()
  }

  /** 新しいシナリオを作成して、すぐ接続する */
  const createAndSelect = () => handleSelect(addAsset('scenarios'))
</script>
