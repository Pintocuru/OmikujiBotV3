<!-- src/manager/components/ManagerFileItem.vue -->
<template>
  <div class="flex items-center justify-between bg-base-300 rounded p-2 text-sm">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1">
        <span class="font-medium truncate">{{ file.displayName }}</span>
        <span v-if="file.meta" class="text-xs opacity-60 shrink-0">v{{ file.meta.version }}</span>
      </div>
      <div v-if="file.meta?.description" class="text-xs opacity-70 line-clamp-2">{{ file.meta.description }}</div>
      <div class="flex flex-wrap items-center gap-1 text-xs">
        <span>{{ formatFileDate(file.modified) }}</span>
        <span v-if="status === 'current'" class="badge badge-success badge-xs">対応</span>
        <span v-else-if="status === 'legacy'" class="badge badge-warning badge-xs">旧バージョン</span>
        <span v-else-if="status === 'unsupported'" class="badge badge-error badge-xs">未対応の新バージョン</span>
      </div>
    </div>

    <div class="flex gap-1 ml-2 shrink-0">
      <!-- 設定を読み込む -->
      <button
        @click="devStore.applyConfigFile(file.name)"
        :disabled="devStore.isLoading || devStore.isAnyLoading || status === 'unsupported'"
        class="btn btn-xs btn-primary tooltip tooltip-top"
        :data-tip="status === 'unsupported' ? 'このアプリでは読み込めない新しい形式です' : 'この設定を読み込む'"
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
  import { computed } from 'vue'
  import type { FileItem } from '@/manager/types'
  import { isDev } from '@/types/env'
  import FileMenuDropdown from './FileMenuDropdown.vue'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { getDataVersionStatus } from '@/manager/services/apiServiceUtils'
  import { Download } from 'lucide-vue-next'

  const props = defineProps<{
    file: FileItem
    formatFileDate: (date: string) => string
    availableFolders: string[]
  }>()

  const devStore = useManagerStore()
  // meta が無いファイルは状態なし(従来どおり読み込める)
  const status = computed(() => (props.file.meta ? getDataVersionStatus(props.file.meta.dataVersion) : null))
</script>
