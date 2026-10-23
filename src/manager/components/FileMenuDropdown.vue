<!-- src/manager/components/FileMenuDropdown.vue -->
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-xs">
      <Menu class="w-3 h-3" />
    </label>

    <ul tabindex="0" class="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52">
      <!-- 部分読み込み -->
      <li>
        <button class="text-sm" :disabled="disabled || importManager.isLoading.value" @click="handlePartialLoad">
          <FileText class="w-4 h-4" />
          部分読み込み
        </button>
      </li>

      <!-- ファイル名変更 -->
      <li>
        <details>
          <summary class="text-sm">
            <Edit class="w-4 h-4" />
            名前変更
          </summary>
          <ul>
            <li>
              <input
                v-model="editingName"
                class="input input-xs w-full"
                placeholder="新しいファイル名"
                @keydown.enter="confirmRename"
                @keydown.escape="cancelRename"
                @click.stop
              />
            </li>
            <li>
              <button class="text-sm" @click="confirmRename">
                <Check class="w-4 h-4" />
                確定
              </button>
            </li>
          </ul>
        </details>
      </li>

      <!-- フォルダへ移動 -->
      <li v-if="showMove">
        <details>
          <summary class="text-sm">
            <FolderInput class="w-4 h-4" />
            移動
          </summary>
          <ul>
            <li v-if="currentFolder !== null">
              <button class="text-sm" @click="$emit('move', '')">
                <Folder class="w-4 h-4" />
                ルート
              </button>
            </li>

            <li v-for="folder in folders" :key="folder">
              <button v-if="folder !== currentFolder" class="text-sm" @click="$emit('move', folder)">
                <Folder class="w-4 h-4" />
                {{ folder }}
              </button>
            </li>

            <li>
              <div>
                <button class="text-sm text-success" @click.stop="isCreatingFolder = true">
                  <FolderPlus class="w-4 h-4" />
                  新規フォルダ
                </button>
                <input
                  ref="newFolderInputRef"
                  v-model="newFolderName"
                  class="input input-xs flex-1 min-w-0"
                  placeholder="フォルダ名"
                  @keydown.enter="confirmNewFolder"
                  @keydown.escape="cancelNewFolder"
                />
                <button class="btn btn-xs btn-success" @click="confirmNewFolder">
                  <Check class="w-3 h-3" />
                </button>
              </div>
            </li>
          </ul>
        </details>
      </li>

      <li>
        <button class="text-sm" @click="$emit('duplicate')">
          <Copy class="w-4 h-4" />
          複製
        </button>
      </li>

      <li>
        <button class="text-sm text-error" :disabled="disableDelete" @click="$emit('delete')">
          <Trash2 class="w-4 h-4" />
          削除
        </button>
      </li>
    </ul>

    <ConfigImportModal v-if="importManager.showPreviewModal.value" :import-manager="importManager" />
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, watch } from 'vue'
  import type { FileItem } from '@/manager/types'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { useImportManager } from '@/editor/helpers/presetsImport/composables/useImportManager'
  import ConfigImportModal from '@/editor/helpers/presetsImport/ConfigImportModal.vue'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { Menu, Copy, Trash2, Folder, FolderInput, FolderPlus, Check, FileText, Edit } from 'lucide-vue-next'

  const props = defineProps<{
    file: FileItem
    folders: string[]
    currentFolder: string | null
    showMove?: boolean
    disableDelete?: boolean
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    move: [folder: string]
    duplicate: []
    delete: []
    rename: [name: string]
  }>()

  const devStore = useManagerStore()
  const importManager = useImportManager()

  // フォルダ作成
  const isCreatingFolder = ref(false)
  const newFolderName = ref('')
  const newFolderInputRef = ref<HTMLInputElement>()

  watch(isCreatingFolder, (val) => {
    if (val) nextTick(() => newFolderInputRef.value?.focus())
  })

  const confirmNewFolder = () => {
    const name = newFolderName.value.trim()

    if (name && /^[\w\-]+$/.test(name) && name !== props.currentFolder) {
      emit('move', name)
    }

    cancelNewFolder()
  }

  const cancelNewFolder = () => {
    isCreatingFolder.value = false
    newFolderName.value = ''
  }

  // ファイル名変更
  const editingName = ref(props.file.displayName)

  const confirmRename = () => {
    const name = editingName.value.trim()

    if (name && name !== props.file.displayName) {
      emit('rename', name)
    }

    editingName.value = props.file.displayName
  }

  const cancelRename = () => {
    editingName.value = props.file.displayName
  }

  // 部分読み込み
  const handlePartialLoad = async () => {
    try {
      const fileData = await devStore.fetchFileData(props.file.name)
      const result = await importManager.loadFromJsonData(fileData)

      if (!result.success) {
        if (result.error === 'invalid-metadata') {
          await swalModal.error({
            title: '無効なファイル',
            text: 'このファイルはおみくじBOTのデータではありません。',
          })
        } else {
          await swalModal.error({
            title: '読み込みエラー',
            text: result.error || '不明なエラーが発生しました',
          })
        }
        return
      }

      importManager.generatePreview()
      importManager.openPreviewModal()
    } catch (error) {
      console.error('Partial load error:', error)

      await swalModal.error({
        title: 'ファイルの読み込みに失敗しました',
        text: 'コンソールログをご確認ください',
      })
    }
  }
</script>
