<!-- src/manager/components/ManagerDialog.vue -->
<!-- 保存済みのデータを選んで開くダイアログ。上部バーの「開く」から表示する -->
<template>
  <dialog ref="dialogRef" class="modal" @close="close">
    <!-- BaseDialog と同じ方式: 開いている間だけ中身を描画し、閉じるアニメーションが終わってから外す(rendered) -->
    <template v-if="rendered">
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
            {{ t('manager.tabPresets') }}
          </button>
          <button
            role="tab"
            class="tab"
            :class="{ 'tab-active font-bold': tab === 'packages' }"
            @click="tab = 'packages'"
          >
            {{ t('manager.tabPackages') }}
          </button>
        </div>

        <!-- 一覧 -->
        <div class="p-2 max-h-[60vh] overflow-y-auto">
          <ManagerFileList v-if="tab === 'presets' && managerStore.isServerConnected" @opened="open = false" />
          <ManagerPackageList v-else-if="tab === 'packages' && open" :key="packageListKey" @open="onOpenPackage" />
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button :aria-label="t('editorUi.dialog.close')" @click="close">{{ t('editorUi.dialog.close') }}</button>
      </form>
    </template>
  </dialog>
</template>

<script setup lang="ts">
  import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
  const managerStore = useManagerStore()
  const { openLocal } = useOpenLocal()
  const { openPackage } = useOpenPackage()
  const tab = ref<'presets' | 'packages'>('presets')
  // 開くたびにパッケージ一覧を取り直すためのキー
  const packageListKey = ref(0)

  // <dialog> + showModal で開閉する(Esc・バックドロップ・フォーカストラップは <dialog> に任せる)。
  // Esc で閉じるとき、SweetAlert2 は <dialog> の中に出るため Esc はそちらが先に処理する
  const dialogRef = ref<HTMLDialogElement | null>(null)

  // 中身(modal-box)を DOM に置いているか。open より少し長く true にして、閉じるアニメーションを見せる
  const rendered = ref(open.value)
  // DaisyUI の modal-box の transition(.3s)に合わせる
  const CLOSE_ANIMATION_MS = 300
  let unmountTimer: ReturnType<typeof setTimeout> | undefined

  const showDialog = () => {
    if (open.value && dialogRef.value && !dialogRef.value.open) dialogRef.value.showModal()
  }

  // 初回(マウントと同時に open=true)は、閉じた状態のスタイルが確定してから開く(でないと transition が走らない)
  onMounted(() => requestAnimationFrame(showDialog))
  onBeforeUnmount(() => clearTimeout(unmountTimer))

  watch(open, async (isOpen) => {
    clearTimeout(unmountTimer)
    if (isOpen) {
      rendered.value = true
      await nextTick()
      void dialogRef.value?.offsetHeight
      showDialog()
    } else {
      dialogRef.value?.close()
      unmountTimer = setTimeout(() => (rendered.value = false), CLOSE_ANIMATION_MS)
    }
  })

  // Esc・バックドロップ・dialog.close() のどれでもここに来る。すでに閉じていれば何もしない
  const close = () => {
    if (open.value) open.value = false
  }

  // 開くたびに一覧を取り直す(初回はマウント時点で open なので immediate)
  watch(
    open,
    (isOpen) => {
      if (!isOpen) return
      tab.value = 'presets'
      managerStore.searchQuery = ''
      packageListKey.value++
      void managerStore.fetchFileList()
    },
    { immediate: true }
  )

  // 開けたら閉じる
  const onOpenLocal = async () => {
    if (await openLocal()) open.value = false
  }
  const onOpenPackage = async (id?: string) => {
    if (await openPackage(id)) open.value = false
  }
</script>
