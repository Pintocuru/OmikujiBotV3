<!-- src/manager/ManagerView.vue -->
<!-- 保存済みのデータを選んで開くダイアログ。上部バーの「開く」から表示する -->
<template>
  <!--
    <dialog> + showModal() にすると、ブラウザの最前面レイヤーに入り、SweetAlert2 の確認ダイアログが後ろに回り込む。
    そのため、DaisyUI の modal-open で開閉する(z-index が SweetAlert2 より低いので、確認ダイアログが手前に出る)
  -->
  <div class="modal" :class="{ 'modal-open': open }" role="dialog" aria-modal="true" @click.self="open = false">
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
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
  const tab = ref<'presets' | 'packages'>('presets')
  // 開くたびにパッケージ一覧を取り直すためのキー
  const packageListKey = ref(0)

  // 開くたびに一覧を取り直す
  watch(open, (isOpen) => {
    if (!isOpen) return
    tab.value = 'presets'
    packageListKey.value++
    void devStore.fetchFileList()
  })

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

  // プリセットを読み込んだら閉じる
  watch(saveFileName, () => (open.value = false))
</script>
