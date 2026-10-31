<!-- src/editor/assets/scenarios/ScenarioConnectDialog.vue -->
<!-- 参照元のないシナリオを、みくじ箱に追加して接続を作るダイアログ -->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="handleDialogClose">
    <div class="modal-box max-w-xl">
      <div class="flex items-center justify-between pb-2">
        <h3 class="text-lg font-bold">{{ t('connections.connectDialog.title') }}</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="close">
          <X :size="16" />
        </button>
      </div>
      <p class="text-sm opacity-70">{{ t('connections.connectDialog.hint') }}</p>

      <div class="max-h-[55vh] overflow-y-auto space-y-2 py-2">
        <div v-if="boxList.length === 0" class="rounded-lg bg-neutral text-neutral-content p-4 text-sm">
          {{ t('connections.connectDialog.empty') }}
        </div>

        <div v-for="box in boxList" :key="box.key" class="rounded-lg border border-base-300 p-3">
          <div class="font-bold truncate">{{ box.name || box.key }}</div>
          <div class="text-xs opacity-60 mt-1 break-all">key: {{ box.key }}</div>
          <button class="btn btn-xs btn-primary mt-2" @click="connect(box)">
            {{ t('connections.connectDialog.connect') }}
          </button>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-sm btn-ghost" @click="close">{{ t('connections.connectDialog.cancel') }}</button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop"><button @click="close">close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { X } from 'lucide-vue-next'
  import { OmikujiItemSchema, type MikujiBoxType } from '@/types/OmikujiData/'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const { t } = useI18n()

  const props = defineProps<{
    open: boolean
    scenarioKey: string
  }>()

  const emit = defineEmits<{
    'update:open': [open: boolean]
    connected: [mikujiKey: string]
  }>()

  const { updateAsset } = useOmikujiStore()
  const { getAssets } = useGetAssetData()

  const dialogRef = ref<HTMLDialogElement | null>(null)

  const boxList = computed(() => Object.values(getAssets('mikuji')).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))

  watch(
    () => props.open,
    (open) => {
      if (open) dialogRef.value?.showModal()
      else dialogRef.value?.close()
    }
  )

  const close = () => emit('update:open', false)
  const handleDialogClose = () => close()

  /** 選択した箱の末尾に、このシナリオを実行するおみくじアイテムを追加する */
  const connect = (box: MikujiBoxType) => {
    if (!props.scenarioKey) return
    const item = OmikujiItemSchema.parse({ kind: 'steps', stepKey: props.scenarioKey })
    updateAsset('mikuji', box.key, { ...box, omikuji: [...(box.omikuji ?? []), item] })
    emit('connected', box.key)
    close()
  }
</script>
