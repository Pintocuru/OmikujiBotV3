// src/manager/stores/useManagerGetters.ts
import { computed } from 'vue'
import { DataManagerType, FileBlock, FileItem } from '@/manager/types'

export function useManagerGetters(state: DataManagerType) {
  // ソート済みファイル一覧
  const sortedFiles = computed(() => {
    return [...state.availableFiles.value].sort(
      (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
    )
  })

  // フォルダ名一覧（全展開ボタン用）
  const folderNames = computed(() => {
    const names = new Set<string>()
    for (const file of state.availableFiles.value) {
      if (file.folder !== null) names.add(file.folder)
    }
    return [...names]
  })

  // 並び替え済みの表示ブロック（ルート直下ファイルの塊 / フォルダ）
  const fileBlocks = computed<FileBlock[]>(() => {
    const mode = state.sortMode.value
    const byName = (a: string, b: string) => a.localeCompare(b, 'ja', { numeric: true })
    const time = (f: FileItem) => new Date(f.modified).getTime() || 0
    const byModifiedDesc = (a: FileItem, b: FileItem) =>
      time(b) - time(a) || byName(a.displayName, b.displayName)
    const sortFiles = (files: FileItem[]) =>
      [...files].sort(mode === 'name' ? (a, b) => byName(a.displayName, b.displayName) : byModifiedDesc)

    // 履歴: フォルダ区分なしで更新日時の新しい順
    if (mode === 'history') {
      const files = [...state.availableFiles.value].sort(byModifiedDesc)
      return files.length > 0 ? [{ type: 'files', key: 'history', files }] : []
    }

    // ルート直下 / フォルダごとに分ける
    const rootFiles: FileItem[] = []
    const groups = new Map<string, FileItem[]>()
    for (const file of state.availableFiles.value) {
      if (file.folder === null) {
        rootFiles.push(file)
      } else {
        if (!groups.has(file.folder)) groups.set(file.folder, [])
        groups.get(file.folder)!.push(file)
      }
    }

    // フォルダの並び替え（更新日時順はフォルダ内の最新ファイルで比較）
    const folders = [...groups.entries()]
      .map(([folder, files]) => ({ folder, files: sortFiles(files), latest: Math.max(...files.map(time)) }))
      .sort((a, b) => (mode === 'name' ? byName(a.folder, b.folder) : b.latest - a.latest || byName(a.folder, b.folder)))

    // フォルダを上、ルート直下のファイルを下に並べる
    const blocks: FileBlock[] = folders.map((f) => ({
      type: 'folder',
      key: `folder:${f.folder}`,
      folder: f.folder,
      files: f.files,
    }))
    if (rootFiles.length > 0) blocks.push({ type: 'files', key: 'root', files: sortFiles(rootFiles) })
    return blocks
  })

  // 特定ファイルの削除中状態
  const isDeletingFile = computed(() => (fileName: string) => {
    return state.isDeletingFileMap.get(fileName) || false
  })

  // 最新ファイル
  const latestFile = computed(() => {
    const files = state.availableFiles.value
    if (files.length === 0) return null
    return files.reduce((latest, current) =>
      new Date(current.modified) > new Date(latest.modified) ? current : latest
    )
  })

  // 統合ローディング状態
  const isAnyLoading = computed(() => {
    return (
      state.isSaving.value ||
      state.isLoading.value ||
      state.isDeleting.value ||
      state.isLoadingFileList.value ||
      state.isExecutingConfirm.value
    )
  })

  // ファイル数
  const fileCount = computed(() => state.availableFiles.value.length)

  // 名前でファイル検索
  const findFileByName = computed(() => (fileName: string) => {
    return state.availableFiles.value.find((file: { name: string }) => file.name === fileName)
  })

  return {
    sortedFiles,
    folderNames,
    fileBlocks,
    isDeletingFile,
    latestFile,
    isAnyLoading,
    fileCount,
    findFileByName,
  }
}
