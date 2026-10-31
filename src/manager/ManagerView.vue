<!-- src/manager/ManagerView.vue -->
<!-- 保存済みファイルを選んで開くダイアログ。上部バーの「開く」から表示する -->
<template>
  <dialog ref="dialogRef" class="modal" @close="open = false">
    <div class="modal-box max-w-5xl w-11/12 p-0 overflow-hidden text-base-content">
      <div class="card bg-linear-to-r from-primary to-secondary rounded-none">
        <div class="card-body px-4 py-2">
          <!-- ヘッダー -->
          <ManagerHeader />

          <!-- 接続ステータス -->
          <div class="text-xs flex items-center text-primary-content gap-2">
            <div class="status" :class="devStore.isServerConnected ? 'status-info' : 'status-error'" />
            <span>{{
              !devStore.isServerConnected
                ? 'サーバー未接続'
                : isExpressMode
                  ? '開発サーバー接続'
                  : 'プラグインサーバー接続'
            }}</span>
          </div>
        </div>
      </div>

      <!-- ブラウザが読み込んでいる omikujiData.js を開く(express / プラグイン共通) -->
      <div class="flex items-center gap-2 px-3 pt-3">
        <button class="btn btn-sm btn-outline" @click="onOpenLocal">
          <FileCode class="w-4 h-4" />
          {{ t('shell.topBar.openLocal') }}
        </button>
        <span class="text-xs opacity-60">{{ t('shell.topBar.openLocalTip') }}</span>
      </div>

      <!-- 読み込みセクション -->
      <div class="p-2 max-h-[65vh] overflow-y-auto">
        <ManagerFileList v-if="devStore.isServerConnected" />
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { FileCode } from 'lucide-vue-next'
  import { useOpenLocal } from './composables/useOpenLocal'
  import ManagerHeader from './components/ManagerHeader.vue'
  import ManagerFileList from './components/ManagerFileList.vue'
  import { useManagerStore } from './stores/useManagerStore'

  const open = defineModel<boolean>('open', { default: false })

  const { t } = useI18n()
  const devStore = useManagerStore()
  const { openLocal } = useOpenLocal()
  const { isExpressMode, saveFileName } = storeToRefs(devStore)
  const dialogRef = ref<HTMLDialogElement | null>(null)

  // 開くたびに一覧を取り直す
  watch(open, (isOpen) => {
    const dialog = dialogRef.value
    if (!dialog) return
    if (isOpen && !dialog.open) {
      void devStore.fetchFileList()
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  })

  // omikujiData.js を開けたら閉じる
  const onOpenLocal = async () => {
    if (await openLocal()) open.value = false
  }

  // ファイルを読み込んだら閉じる
  watch(saveFileName, () => (open.value = false))
</script>
