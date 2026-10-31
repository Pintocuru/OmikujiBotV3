<!-- src/manager/ManagerView.vue -->
<!-- 保存済みのデータを選んで開くダイアログ。上部バーの「開く」から表示する -->
<template>
  <dialog ref="dialogRef" class="modal" @close="open = false">
    <div class="modal-box max-w-5xl w-11/12 p-0 overflow-hidden text-base-content">
      <div class="card bg-linear-to-r from-primary to-secondary rounded-none">
        <div class="card-body px-4 py-2">
          <!-- ヘッダー -->
          <ManagerHeader :showFileTools="tab === 'presets'" />
        </div>
      </div>

      <!-- 開く手段: どちらも同じ高さ・同じ見た目で並べる -->
      <div class="flex flex-wrap items-center gap-2 px-3 pt-3">
        <button class="btn btn-sm btn-outline" :disabled="devStore.isLoading" @click="onOpenLocal">
          <FileCode class="w-4 h-4" />
          {{ t('shell.topBar.openLocal') }}
        </button>
        <button
          v-if="!isExpressMode"
          class="btn btn-sm btn-outline"
          :disabled="devStore.isLoading"
          :title="t('shell.topBar.openGeneratorTip')"
          @click="onOpenPackage()"
        >
          <Download class="w-4 h-4" />
          {{ t('shell.topBar.openGenerator') }}
        </button>
      </div>

      <!-- 保存先の切り替え -->
      <div role="tablist" class="tabs tabs-border px-3 pt-2">
        <button role="tab" class="tab" :class="{ 'tab-active font-bold': tab === 'presets' }" @click="tab = 'presets'">
          {{ t('shell.topBar.tabPresets') }}
        </button>
        <button
          role="tab"
          class="tab"
          :class="{ 'tab-active font-bold': tab === 'packages' }"
          @click="tab = 'packages'"
        >
          {{ t('shell.topBar.tabPackages') }}
        </button>
      </div>

      <!-- 一覧 -->
      <div class="p-2 max-h-[60vh] overflow-y-auto">
        <ManagerFileList v-if="tab === 'presets' && devStore.isServerConnected" />
        <ManagerPackageList v-else-if="tab === 'packages' && open" :key="packageListKey" @open="onOpenPackage" />
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { Download, FileCode } from 'lucide-vue-next'
  import { useOpenLocal } from './composables/useOpenLocal'
  import { useOpenPackage } from './composables/useOpenPackage'
  import ManagerHeader from './components/ManagerHeader.vue'
  import ManagerFileList from './components/ManagerFileList.vue'
  import ManagerPackageList from './components/ManagerPackageList.vue'
  import { useManagerStore } from './stores/useManagerStore'

  const open = defineModel<boolean>('open', { default: false })

  const { t } = useI18n()
  const devStore = useManagerStore()
  const { openLocal } = useOpenLocal()
  const { openPackage } = useOpenPackage()
  const { isExpressMode, saveFileName } = storeToRefs(devStore)
  const dialogRef = ref<HTMLDialogElement | null>(null)

  const tab = ref<'presets' | 'packages'>('presets')
  // 開くたびにパッケージ一覧を取り直すためのキー
  const packageListKey = ref(0)

  // 開くたびに一覧を取り直す
  watch(open, (isOpen) => {
    const dialog = dialogRef.value
    if (!dialog) return
    if (isOpen && !dialog.open) {
      tab.value = 'presets'
      packageListKey.value++
      void devStore.fetchFileList()
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  })

  // 開けたら閉じる
  const onOpenLocal = async () => {
    if (await openLocal()) open.value = false
  }
  const onOpenPackage = async (id?: string) => {
    if (await openPackage(id)) open.value = false
  }

  // プリセットを読み込んだら閉じる
  watch(saveFileName, () => (open.value = false))
</script>
