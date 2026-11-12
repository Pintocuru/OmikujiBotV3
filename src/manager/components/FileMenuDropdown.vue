<!-- src/manager/components/FileMenuDropdown.vue -->
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-xs">
      <Menu class="w-3 h-3" />
    </label>

    <ul tabindex="0" class="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52">
      <!-- {{ t('manager.files.partialLoad') }} -->
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
            {{ t('manager.files.rename') }}
          </summary>
          <ul>
            <li>
              <input
                v-model="editingName"
                class="input input-xs w-full"
                 :placeholder="t('manager.files.newName')"
                @keydown.enter="confirmRename"
                @keydown.escape="cancelRename"
                @click.stop
              />
            </li>
            <li>
              <button class="text-sm" @click="confirmRename">
                <Check class="w-4 h-4" />
                {{ t('manager.files.confirm') }}
              </button>
            </li>
          </ul>
        </details>
      </li>

      <!-- フォルダへ{{ t('manager.files.move') }} -->
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
                {{ t('manager.folders.root') }}
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
                  {{ t('manager.folders.create') }}
                </button>
                <input
                  ref="newFolderInputRef"
                  v-model="newFolderName"
                  class="input input-xs flex-1 min-w-0"
                   :placeholder="t('manager.folders.name')"
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
          {{ t('manager.files.duplicate') }}
        </button>
      </li>

      <li>
        <button class="text-sm text-error" :disabled="disableDelete" @click="$emit('delete')">
          <Trash2 class="w-4 h-4" />
          {{ t('manager.files.delete') }}
        </button>
      </li>
    </ul>

    <ConfigImportModal v-if="importManager.showPreviewModal.value" :import-manager="importManager" />
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, watch } from 'vue'\n  import { useI18n } from 'vue-i18n'
  import type { FileItem } from '@/manager/types'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { useImportManager } from '@/editor/helpers/presetsImport/composables/useImportManager'
  import ConfigImportModal from '@/editor/helpers/presetsImport/ConfigImportModal.vue'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { PRESET_NAME_RULE, isValidPresetName } from '@/manager/services/apiServiceUtils'
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

  const { t } = useI18n()\n  const managerStore = useManagerStore()
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

    if (name && name !== props.currentFolder) {
      // サーバーが半角英数字しか受け付けないため。黙って閉じず、理由を伝えて入力を残す
      if (!isValidPresetName(name)) {
        swalToast.warning({ title: '${t('manager.messages.folderNameInvalid')}', text: PRESET_NAME_RULE })
        return
      }
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
      const fileData = await managerStore.fetchFileData(props.file.name)
      const result = await importManager.loadFromJsonData(fileData)

      if (!result.success) {
        if (result.error === 'invalid-metadata') {
          await swalModal.error({
            title: t('manager.messages.invalidFile'),
            text: '${t('manager.messages.notOmikujiData')}',
          })
        } else {
          await swalModal.error({
            title: t('manager.messages.loadError'),
            text: result.error || '${t('manager.messages.unknownError')}',
          })
        }
        return
      }

      importManager.generatePreview()
      importManager.openPreviewModal()
    } catch (error) {
      console.error('Partial load error:', error)

      await swalModal.error({
        title: t('manager.messages.loadFailed'),
        text: '${t('manager.messages.checkConsole')}',
      })
    }
  }
</script>
