<!-- src/manager/components/ManagerFileItem.vue -->
<template>
  <div class="flex items-center justify-between bg-base-300 rounded p-2 text-sm">
    <div class="flex-1 min-w-0">
      <div
        class="flex items-center tooltip tooltip-top"
        :data-tip="file.meta ? `${file.meta.name} ${file.meta.version}` : undefined"
      >
        <!-- ファイル名 -->
        <span class="font-medium">{{ file.displayName }}</span>
        <span v-if="file.meta" class="ml-2 text-xs opacity-60 truncate">{{ file.meta.version }}</span>
      </div>
      <!-- 説明 -->
      <div v-if="file.meta?.description" class="text-[10px] opacity-70 line-clamp-1">{{ file.meta.description }}</div>
      <!-- 更新日時 -->
      <div class="flex flex-wrap items-center pt-1 gap-1 text-xs">
        <span>{{ formatFileDate(file.modified) }}</span>
        <span v-if="status === 'legacy' && (file.meta?.dataVersion ?? 0) < 3" class="badge badge-warning badge-xs"
          >Ver2</span
        >
        <!-- TODO:製品版の際には名称を修正すること -->
        <span v-else-if="status === 'legacy'" class="badge badge-error text-error-content badge-xs">{{
          t('manager.files.legacy')
        }}</span>
        <span v-else-if="status === 'unsupported'" class="badge badge-error badge-xs">{{
          t('manager.files.unsupported')
        }}</span>
      </div>
    </div>

    <div class="flex gap-1 ml-2 shrink-0">
      <!-- 設定を読み込む -->
      <button
        @click="onApply"
        :disabled="managerStore.isLoading || managerStore.isAnyLoading || status === 'unsupported'"
        class="btn btn-xs btn-primary tooltip tooltip-top"
        :data-tip="status === 'unsupported' ? t('manager.files.unsupportedTip') : t('manager.files.load')"
      >
        <Download class="w-3 h-3" />
      </button>

      <FileMenuDropdown
        :file="file"
        :folders="availableFolders"
        :current-folder="file.folder"
        :show-move="isDev"
        :disable-delete="managerStore.isDeletingFile(file.name) || managerStore.isAnyLoading"
        :disabled="managerStore.isAnyLoading"
        @move="(folder) => managerStore.moveFile(file.name, folder)"
        @duplicate="managerStore.duplicateFile(file.name)"
        @delete="managerStore.deleteFile(file.name)"
        @rename="(name) => managerStore.renameFile(file.name, name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { FileItem } from '@/manager/types'
  import { isDev } from '@/common/AppEnv'
  import FileMenuDropdown from './FileMenuDropdown.vue'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { getDataVersionStatus } from '@/manager/services/apiServiceUtils'
  import { Download } from 'lucide-vue-next'

  const props = defineProps<{
    file: FileItem
    formatFileDate: (date: string) => string
    availableFolders: string[]
  }>()

  const emit = defineEmits<{ opened: [] }>()

  const { t } = useI18n()
  const managerStore = useManagerStore()

  // 読み込めたら親(ダイアログ)に知らせる。同じファイルを読み直しても閉じられるよう、戻り値で判定する
  const onApply = async () => {
    if (await managerStore.applyConfigFile(props.file.name)) emit('opened')
  }
  // meta が無いファイルは状態なし(従来どおり読み込める)
  const status = computed(() => (props.file.meta ? getDataVersionStatus(props.file.meta.dataVersion) : null))
</script>
