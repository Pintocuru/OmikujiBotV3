// src/manager/stores/useApiFileActions.ts
import { DataManagerType } from '@/manager/types'
import { AsyncActionHandler } from './useApiCore'
import { configApi } from '@/manager/services/configApi'
import {
  PRESET_NAME_RULE,
  ensureJsonExtension,
  generateCopyName,
  isValidPresetName,
} from '@/manager/services/apiServiceUtils'
import { escapeHtml } from '@/common/escapeHtml'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

export function useFileActions(state: DataManagerType, handleAsyncAction: AsyncActionHandler) {
  // ファイル一覧取得
  const fetchFileList = async () => {
    return await handleAsyncAction(async () => {
      const files = await configApi.getFileList()
      state.availableFiles.value = files
      state.isServerConnected.value = true
      return files
    }, 'isLoadingFileList')
  }

  // ファイル複製
  const duplicateFile = async (fileName: string) => {
    return await handleAsyncAction(async () => {
      const configData = await configApi.loadConfig(fileName)
      // 既存のファイルを上書きしないよう、重ならない名前にする
      const duplicateName = generateCopyName(
        fileName,
        state.availableFiles.value.map((f) => f.name)
      )

      await configApi.saveConfig(duplicateName, JSON.stringify(configData))
      await fetchFileList()

      // 成功トースト
      const displayName = fileName.split('/').pop()!.replace('.json', '')
      swalToast.success({ title: `設定ファイル "${displayName}" を複製しました` })
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // ファイルを別フォルダへ移動
  const moveFile = async (fromName: string, toFolder: string) => {
    const fileName = fromName.split('/').pop()! // "file.json"
    const toName = toFolder ? `${toFolder}/${fileName}` : fileName

    if (fromName === toName) return

    return await handleAsyncAction(async () => {
      await configApi.moveConfig(fromName, toName)
      await fetchFileList()

      // 成功トースト
      const destination = toFolder ? `"${toFolder}"` : 'ルート'
      swalToast.success({ title: `設定ファイル "${fromName.replace('.json', '')}" を ${destination} に移動しました` })
    }, 'isLoading')
  }

  // ファイル名変更
  const renameFile = async (oldFileName: string, newFileName: string) => {
    const newName = newFileName.trim().replace(/\.json$/, '')
    if (!isValidPresetName(newName)) {
      swalToast.error({ title: '使えない文字が含まれています', text: PRESET_NAME_RULE })
      return null
    }

    // フォルダは全階層を保持する
    const folder = oldFileName.includes('/') ? oldFileName.slice(0, oldFileName.lastIndexOf('/')) : null
    const finalName = ensureJsonExtension(folder ? `${folder}/${newName}` : newName)
    const finalKey = finalName.toLowerCase()

    // 大文字小文字だけの違いは、Windows では同じファイルを指す。保存→旧名の削除で、ファイルごと消えてしまう
    if (oldFileName.toLowerCase() === finalKey) {
      swalToast.warning({ title: '大文字小文字だけの変更はできません' })
      return null
    }
    if (state.availableFiles.value.some((f) => f.name.toLowerCase() === finalKey)) {
      swalToast.error({ title: '同じ名前のファイルがあります', text: newName })
      return null
    }

    return await handleAsyncAction(async () => {
      // データ読み込み → 新しい名前で保存 → 古いファイルを削除
      const configData = await configApi.loadConfig(oldFileName)
      await configApi.saveConfig(finalName, JSON.stringify(configData))
      await configApi.deleteConfig(oldFileName)
      await fetchFileList()

      swalToast.success({
        title: `設定ファイル名を "${oldFileName.replace('.json', '')}" から "${newName}" に変更しました`,
      })

      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // ファイル削除（確認ダイアログ）
  const deleteFile = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    const result = await swalModal.confirmDelete({
      title: `設定ファイル "${escapeHtml(displayName)}" を削除しますか？`,
    })

    if (!result.isConfirmed) return

    state.isDeletingFileMap.set(fileName, true)

    try {
      await configApi.deleteConfig(fileName)

      const index = state.availableFiles.value.findIndex((f: any) => f.name === fileName)
      if (index >= 0) state.availableFiles.value.splice(index, 1)

      swalToast.success({ title: `設定ファイル "${displayName}" を削除しました` })
      state.isServerConnected.value = true
    } catch (error) {
      console.error('API Error:', error)
      state.isServerConnected.value = false

      // エラーダイアログ
      const message = `${(error as Error).message}\nサーバーが起動していることを確認してください。`
      swalModal.error({ title: '接続エラー', text: message })
    } finally {
      state.isDeletingFileMap.delete(fileName)
    }
  }

  return {
    fetchFileList,
    duplicateFile,
    renameFile,
    moveFile,
    deleteFile,
  }
}
