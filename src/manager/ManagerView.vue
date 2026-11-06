<!-- src/manager/ManagerView.vue -->
<!-- 上部バーの「開く」ボタン。サーバー接続時は保存済みデータの選択ダイアログ、未接続時は omikujiData.js を直接開く -->
<template>
  <button class="btn btn-sm btn-neutral" :title="t('shell.topBar.openTip')" @click="onOpen">
    <FolderOpen class="w-4 h-4" />
    {{ t('shell.topBar.open') }}
  </button>

  <!-- ダイアログは初めて開くときに読み込む(以降は開閉アニメーションを保つため常駐させる) -->
  <ManagerDialog v-if="isDialogLoaded" v-model:open="isDialogOpen" />
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { FolderOpen } from 'lucide-vue-next'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { useOpenLocal } from './composables/useOpenLocal'
  import { useManagerStore } from './stores/useManagerStore'

  const loadDialog = () => import('./components/ManagerDialog.vue')
  const ManagerDialog = defineAsyncComponent(loadDialog)

  const { t } = useI18n()
  const { isServerConnected } = storeToRefs(useManagerStore())
  const { openLocal } = useOpenLocal()

  const isDialogLoaded = ref(false)
  const isDialogOpen = ref(false)

  const onOpen = async () => {
    // サーバー未接続ならダイアログは使えないので、読み込まずに omikujiData.js を直接開く(成功後は useOpenLocal 側で TopPage に戻る)
    if (!isServerConnected.value) {
      await openLocal()
      return
    }

    // 先に読み込んでおく(失敗したときに、何も起きないまま終わらないようにする)
    try {
      await loadDialog()
    } catch (error) {
      swalToast.error({ title: '画面の読み込みに失敗しました', text: String(error) })
      return
    }
    isDialogLoaded.value = true
    isDialogOpen.value = true
  }
</script>
