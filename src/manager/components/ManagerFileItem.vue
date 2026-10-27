<!-- src/manager/components/ManagerFileItem.vue -->
<template>
  <div class="flex items-center justify-between bg-base-300 rounded p-2 text-sm">
    <div class="flex-1 min-w-0">
      <div class="font-medium">{{ file.displayName }}</div>
      <div class="text-xs">{{ formatFileDate(file.modified) }}</div>
    </div>

    <div class="flex gap-1 ml-2 shrink-0">
      <!-- 設定を読み込む -->
      <button
        @click="devStore.applyConfigFile(file.name)"
        :disabled="devStore.isLoading || devStore.isAnyLoading"
        class="btn btn-xs btn-primary tooltip tooltip-bottom"
        data-tip="この設定を読み込む"
      >
        <Download class="w-3 h-3" />
      </button>

      <FileMenuDropdown
        :file="file"
        :folders="availableFolders"
        :current-folder="file.folder"
        :show-move="isDev"
        :disable-delete="devStore.isDeletingFile(file.name) || devStore.isAnyLoading"
        :disabled="devStore.isAnyLoading"
        @move="(folder) => devStore.moveFile(file.name, folder)"
        @duplicate="devStore.duplicateFile(file.name)"
        @delete="devStore.deleteFile(file.name)"
        @rename="(name) => devStore.renameFile(file.name, name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { FileItem } from '@/manager/types'
  import { isDev } from '@/types/env'
  import FileMenuDropdown from './FileMenuDropdown.vue'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { Download } from 'lucide-vue-next'

  defineProps<{
    file: FileItem
    formatFileDate: (date: string) => string
    availableFolders: string[]
  }>()

  const devStore = useManagerStore()
</script>
