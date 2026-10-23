<!-- src/manager/components/ManagerFileList.vue -->
<template>
  <div class="card bg-base-200 p-2 space-y-2">
    <template v-if="devStore.availableFiles.length > 0">
      <template v-for="block in devStore.fileBlocks" :key="block.key">
        <!-- ルート直下 -->
        <div v-if="block.type === 'files'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          <ManagerFileItem
            v-for="file in block.files"
            :key="file.name"
            :file="file"
            :format-file-date="formatFileDate"
            :available-folders="devStore.folderNames"
          />
        </div>

        <!-- フォルダグループ（デフォルト閉じ） -->
        <div v-else>
          <button
            class="flex items-center gap-1 text-xs font-bold opacity-70 hover:opacity-100 w-full text-left mb-1"
            @click="toggleFolder(block.folder)"
          >
            <component :is="devStore.openFolders.has(block.folder) ? ChevronDown : ChevronRight" class="w-3 h-3" />
            <Folder class="w-3 h-3" />
            {{ block.folder }}
            <span class="opacity-50">（{{ block.files.length }}）</span>
          </button>

          <div v-if="devStore.openFolders.has(block.folder)" class="grid grid-cols-2 md:grid-cols-3 gap-1 pl-2">
            <ManagerFileItem
              v-for="file in block.files"
              :key="file.name"
              :file="file"
              :format-file-date="formatFileDate"
              :available-folders="devStore.folderNames"
            />
          </div>
        </div>
      </template>
    </template>

    <div v-else-if="!devStore.isLoadingFileList" class="text-xs opacity-70 text-center py-4">
      保存済みファイルはありません
    </div>

    <div v-else class="text-xs opacity-70 text-center py-4">
      <span class="loading loading-spinner loading-xs mr-2"></span>
      ファイル一覧を読み込み中...
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import ManagerFileItem from './ManagerFileItem.vue'
  import { formatFileDate } from '@/manager/services/apiServiceUtils'
  import { Folder, ChevronDown, ChevronRight } from 'lucide-vue-next'

  const devStore = useManagerStore()

  const toggleFolder = (folder: string) => {
    if (devStore.openFolders.has(folder)) {
      devStore.openFolders.delete(folder)
    } else {
      devStore.openFolders.add(folder)
    }
  }
</script>
