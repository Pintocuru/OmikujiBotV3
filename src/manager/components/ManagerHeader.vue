<!-- src/manager/components/ManagerHeader.vue -->
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <!-- APIモード切り替えバッジ -->
      <button
        @click="toggleApiMode"
        :disabled="!isDev"
        class="badge transition-colors"
        :class="[
          managerStore.isExpressMode ? 'badge-warning' : 'badge-info',
          isDev && 'cursor-pointer hover:opacity-80',
        ]"
        :title="isDev ? t('manager.messages.apiModeTip') : undefined"
      >
        {{ managerStore.isExpressMode ? 'DEV' : 'Plugin' }}
      </button>
      <h2 class="text-lg font-bold text-primary-content">{{ t('manager.title') }}</h2>
    </div>

    <div v-if="managerStore.isServerConnected && showFileTools" class="flex items-center gap-2">
      <!-- 検索(全フォルダ対象) -->
      <input
        v-model="managerStore.searchQuery"
        type="search"
        class="input input-xs w-48"
         :placeholder="t('manager.searchPlaceholder')"
      />
      <!-- 一覧の並び替え -->
      <select v-model="managerStore.sortMode" class="select select-xs w-52"  :title="t('manager.sort.label')">
        <option value="modified">{{ t('manager.sort.modified') }}</option>
        <option value="name">{{ t('manager.sort.name') }}</option>
        <option value="history">{{ t('manager.sort.history') }}</option>
      </select>
      <div v-if="managerStore.sortMode !== 'history' && managerStore.folderNames.length > 0" class="join">
        <button
          @click="expandAllFolders"
          class="btn btn-ghost btn-xs btn-square join-item tooltip tooltip-bottom"
           :data-tip="t('manager.folders.expandAll')"
        >
          <ChevronsDown class="w-4 h-4" />
        </button>
        <button
          @click="collapseAllFolders"
          class="btn btn-ghost btn-xs btn-square join-item tooltip tooltip-bottom"
           :data-tip="t('manager.folders.collapseAll')"
        >
          <ChevronsUp class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { isDev } from '@/common/AppEnv'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { ChevronsDown, ChevronsUp } from 'lucide-vue-next'

  // 並び替え・フォルダ開閉はプリセット一覧用なので、パッケージ一覧では隠す
  withDefaults(defineProps<{ showFileTools?: boolean }>(), { showFileTools: true })

  const { t } = useI18n()
  const managerStore = useManagerStore()

  const expandAllFolders = () => {
    managerStore.openFolders = new Set(managerStore.folderNames)
  }
  const collapseAllFolders = () => {
    managerStore.openFolders = new Set()
  }

  const toggleApiMode = async () => {
    const ok = await managerStore.toggleExpressMode()
    if (ok) {
      await managerStore.fetchFileList()
    } else if (isDev) {
      swalToast.error({
        title: t('manager.messages.pluginServerStoppedTitle'),
        text: t('manager.messages.pluginServerStoppedText'),
      })
    }
  }
</script>
