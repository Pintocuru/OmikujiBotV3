<!-- src/manager/components/ManagerDialog.vue -->
<!-- 保存済みのデータを選んで開くダイアログ。上部バーの「開く」から表示する -->
<template>
  <div class="modal" :class="{ 'modal-open': isShown }" role="dialog" aria-modal="true" @click.self="open = false">
    <div class="modal-box max-w-5xl w-11/12 p-0 overflow-hidden text-base-content">
      <div class="card bg-linear-to-r from-primary to-secondary rounded-none">
        <div class="card-body px-4 py-2">
          <!-- ヘッダー -->
          <ManagerHeader :showFileTools="tab === 'presets'" />
        </div>
      </div>

      <!-- 開く手段 -->
      <OpenSourceBar @open-local="onOpenLocal" @open-package="onOpenPackage()" />

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
        <ManagerFileList v-if="tab === 'presets' && devStore.isServerConnected" @opened="open = false" />
        <ManagerPackageList v-else-if="tab === 'packages' && open" :key="packageListKey" @open="onOpenPackage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useOpenLocal } from '../composables/useOpenLocal'
  import { useOpenPackage } from '../composables/useOpenPackage'
  import ManagerHeader from './ManagerHeader.vue'
  import OpenSourceBar from './OpenSourceBar.vue'
  import ManagerFileList from './ManagerFileList.vue'
  import ManagerPackageList from './ManagerPackageList.vue'
  import { useManagerStore } from '../stores/useManagerStore'

  const open = defineModel<boolean>('open', { default: false })

  const { t } = useI18n()
  const devStore = useManagerStore()
  const { openLocal } = useOpenLocal()
  const { openPackage } = useOpenPackage()
  const tab = ref<'presets' | 'packages'>('presets')
  // 開くたびにパッケージ一覧を取り直すためのキー
  const packageListKey = ref(0)

  // 見た目の開閉。DaisyUI の modal は「閉じた状態 → modal-open」の CSS transition でアニメーションするため、
  // 初回(マウントと同時に open=true)は 1 フレーム待ってから modal-open を付ける
  const isShown = ref(false)
  onMounted(() => requestAnimationFrame(() => (isShown.value = open.value)))
  watch(open, (isOpen) => (isShown.value = isOpen))

  // 開くたびに一覧を取り直す(初回はマウント時点で open なので immediate)
  watch(
    open,
    (isOpen) => {
      if (!isOpen) return
      tab.value = 'presets'
      devStore.searchQuery = ''
      packageListKey.value++
      void devStore.fetchFileList()
    },
    { immediate: true }
  )

  // Esc で閉じる(確認ダイアログ SweetAlert2 が出ている間は、そちらを優先する)
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open.value && !document.querySelector('.swal2-container')) open.value = false
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

  // 開けたら閉じる
  const onOpenLocal = async () => {
    if (await openLocal()) open.value = false
  }
  const onOpenPackage = async (id?: string) => {
    if (await openPackage(id)) open.value = false
  }
</script>
