<!-- src/manager/components/ManagerFileList.vue -->
<template>
  <div class="card bg-base-200 p-2 space-y-2">
    <template v-if="managerStore.availableFiles.length > 0">
      <div v-if="managerStore.fileBlocks.length === 0" class="text-xs opacity-70 text-center py-4">
        {{ t('manager.files.noMatch') }}
      </div>
      <template v-for="block in managerStore.fileBlocks" :key="block.key">
        <!-- ルート直下 -->
        <div v-if="block.type === 'files'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          <ManagerFileItem
            v-for="file in block.files"
            :key="file.name"
            :file="file"
            :format-file-date="formatFileDate"
            :available-folders="managerStore.folderNames"
            @opened="emit('opened')"
          />
        </div>

        <!-- フォルダグループ（デフォルト閉じ） -->
        <div v-else>
          <button
            class="flex items-center gap-1 text-xs font-bold opacity-70 hover:opacity-100 w-full text-left mb-1"
            @click="toggleFolder(block.folder)"
          >
            <component :is="isOpen(block.folder) ? ChevronDown : ChevronRight" class="w-3 h-3" />
            <Folder class="w-3 h-3" />
            {{ block.folder }}
            <span class="opacity-50">（{{ block.files.length }}）</span>
          </button>

          <div v-if="isOpen(block.folder)" class="grid grid-cols-2 md:grid-cols-3 gap-1 pl-2">
            <ManagerFileItem
              v-for="file in block.files"
              :key="file.name"
              :file="file"
              :format-file-date="formatFileDate"
              :available-folders="managerStore.folderNames"
              @opened="emit('opened')"
            />
          </div>
        </div>
      </template>
    </template>

    <div v-else-if="!managerStore.isLoadingFileList" class="text-xs opacity-70 text-center py-4">
      {{ t('manager.files.empty') }}
    </div>

    <div v-else class="text-xs opacity-70 text-center py-4">
      <span class="loading loading-spinner loading-xs mr-2"></span>
      {{ t('manager.files.loading') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import ManagerFileItem from './ManagerFileItem.vue'
  import { formatFileDate } from '@/manager/services/apiServiceUtils'
  import { Folder, ChevronDown, ChevronRight } from 'lucide-vue-next'

  const emit = defineEmits<{ opened: [] }>()

  const { t } = useI18n()
  const managerStore = useManagerStore()

  // 検索中は該当ファイルを見逃さないよう、全フォルダを開いて表示する
  const isOpen = (folder: string) => managerStore.searchQuery.trim() !== '' || managerStore.openFolders.has(folder)

  const toggleFolder = (folder: string) => {
    if (managerStore.openFolders.has(folder)) {
      managerStore.openFolders.delete(folder)
    } else {
      managerStore.openFolders.add(folder)
    }
  }
</script>
