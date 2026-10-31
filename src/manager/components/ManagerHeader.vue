<!-- src/manager/components/ManagerHeader.vue -->
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <!-- APIモード切り替えバッジ -->
      <button
        @click="toggleApiMode"
        :disabled="!isDev"
        class="badge transition-colors"
        :class="[devStore.isExpressMode ? 'badge-warning' : 'badge-info', isDev && 'cursor-pointer hover:opacity-80']"
        :title="isDev ? 'クリックでAPIモードを切り替え' : undefined"
      >
        {{ devStore.isExpressMode ? 'DEV' : 'Plugin' }}
      </button>
      <h2 class="text-lg font-bold text-primary-content">
        {{ isDev ? 'プリセット管理' : 'サーバー連携機能' }}
      </h2>
    </div>

    <div v-if="devStore.isServerConnected && showFileTools" class="flex items-center gap-2">
      <!-- 一覧の並び替え -->
      <select v-model="devStore.sortMode" class="select select-xs w-52" title="並び順">
        <option value="name">名前（A→Z）</option>
        <option value="modified">更新日時（新しい順）</option>
        <option value="history">履歴（新しい順）</option>
      </select>
      <div v-if="devStore.sortMode !== 'history' && devStore.folderNames.length > 0" class="join">
        <button
          @click="expandAllFolders"
          class="btn btn-ghost btn-xs btn-square join-item tooltip tooltip-bottom"
          data-tip="全フォルダを開く"
        >
          <ChevronsDown class="w-4 h-4" />
        </button>
        <button
          @click="collapseAllFolders"
          class="btn btn-ghost btn-xs btn-square join-item tooltip tooltip-bottom"
          data-tip="全フォルダを閉じる"
        >
          <ChevronsUp class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { isDev } from '@/types/env'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { ChevronsDown, ChevronsUp } from 'lucide-vue-next'

  // 並び替え・フォルダ開閉はプリセット一覧用なので、パッケージ一覧では隠す
  withDefaults(defineProps<{ showFileTools?: boolean }>(), { showFileTools: true })

  const devStore = useManagerStore()

  const expandAllFolders = () => {
    devStore.openFolders = new Set(devStore.folderNames)
  }
  const collapseAllFolders = () => {
    devStore.openFolders = new Set()
  }

  const toggleApiMode = async () => {
    const ok = await devStore.toggleExpressMode()
    if (ok) {
      await devStore.fetchFileList()
    } else if (isDev) {
      swalToast.error({
        title: 'プラグインサーバ起動しとらんやん！',
        text: '動かん思たら…そらサーバー止まっとったら無理やわな！',
      })
    }
  }
</script>
