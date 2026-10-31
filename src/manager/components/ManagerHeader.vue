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

    <div v-if="devStore.isServerConnected" class="flex items-center gap-2">
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

      <template v-if="!isExpressMode">
        <button
          @click="loadFromGenerator"
          :disabled="devStore.isSaving"
          class="btn btn-secondary btn-sm tooltip tooltip-top"
          data-tip="「ジェネレーター用に保存」した設定を読み込む"
        >
          <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
          <Download class="w-4 h-4 mr-2" />
          ジェネレーター用を読み込み
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types/env'
  import { generatorApi } from '@/manager/services/generatorApi'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { Download, ChevronsDown, ChevronsUp } from 'lucide-vue-next'
  import { FILE_NAME } from '@server/core/constants'

  const omikujiStore = useOmikujiStore()
  const { hasChanged } = storeToRefs(omikujiStore)
  const navigationStore = useNavigationStore()
  const devStore = useManagerStore()
  const { isExpressMode } = storeToRefs(devStore)

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

  const loadFromGenerator = async () => {
    try {
      // 変更があるなら確認ダイアログ
      if (hasChanged.value) {
        const result = await swalModal.confirmDelete({
          title: '変更が保存されていません',
          text: '読み込むと現在の編集内容は失われます。続行しますか？',
          confirmButtonText: '読み込む',
        })
        // キャンセル → 処理中断
        if (!result.isConfirmed) return
      }

      const { loadData } = useOmikujiStore()
      const id = window.omikujiData?.meta.id
      const data = await generatorApi.loadGeneratorConfig(id)
      const fileName = id ? `packages/${id}.json` : FILE_NAME.generator

      if (!data) {
        swalToast.warning({
          title: 'ジェネレーター設定が見つかりません',
          text: `${fileName} が存在しませんでした`,
        })
        return
      }

      // ファイル読み込み
      devStore.setSaveFileName()
      if (!loadData(data)) return // 読み込み拒否(エラー表示済み)
      navigationStore.selectCategory(data.settings?.editor?.initialCategory ?? 'comments')
      hasChanged.value = false // 読み込み後は変更なし状態に戻す

      swalToast.success({ title: 'ジェネレーター設定を読み込みました' })
    } catch (error) {
      swalToast.error({
        title: '読み込みに失敗しました',
        text: String(error),
      })
    }
  }
</script>
