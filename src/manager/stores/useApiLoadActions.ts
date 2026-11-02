// src/manager/stores/useApiLoadActions.ts
import { DataManagerType } from '@/manager/types'
import { AsyncActionHandler } from './useApiCore'
import { configApi } from '@/manager/services/configApi'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { getDataVersionStatus } from '@/manager/services/apiServiceUtils'
import { DATA_VERSION } from '@/version'

export function useLoadActions(state: DataManagerType, handleAsyncAction: AsyncActionHandler) {
  // 設定読み込み
  const applyConfigFile = async (fileName: string) => {
    const omikujiStore = useOmikujiStore()
    const navigationStore = useNavigationStore()
    const hasChanged = omikujiStore.hasChanged

    // アプリ未対応の新しい dataVersion は読み込まない(一覧の無効化に頼らない)
    const file = state.availableFiles.value.find((f) => f.name === fileName)
    if (file?.meta && getDataVersionStatus(file.meta.dataVersion) === 'unsupported') {
      swalToast.error({
        title: '読み込めません',
        text: `このデータは v${file.meta.dataVersion} 形式です。このアプリ（v${DATA_VERSION}）では読み込めません。`,
      })
      return null
    }

    // 変更があるなら確認ダイアログ
    if (hasChanged) {
      const result = await swalModal.confirmDelete({
        title: '変更が保存されていません',
        text: '読み込むと現在の編集内容は失われます。続行しますか？',
        confirmButtonText: '読み込む',
      })

      if (!result.isConfirmed) {
        return null // キャンセル → 処理中断
      }
    }

    // 実処理は handleAsyncAction に任せる
    return await handleAsyncAction(async () => {
      const configData = await configApi.loadConfig(fileName)

      if (!omikujiStore.loadData(configData)) return null // 読み込み拒否(エラー表示済み)
      navigationStore.showTopPage()
      state.saveFileName.value = fileName

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true

      return configData
    }, 'isLoading')
  }

  // ファイルデータのみ取得
  const fetchFileData = async (fileName: string) => {
    return await configApi.loadConfig(fileName)
  }

  return {
    applyConfigFile,
    fetchFileData,
  }
}
