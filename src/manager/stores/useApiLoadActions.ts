// src/manager/stores/useApiLoadActions.ts
import { DataManagerType } from '@/manager/types'
import { AsyncActionHandler } from './useApiCore'
import { configApi } from '@/manager/services/configApi'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import i18n from '@/editor/i18n'
const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))
import { getDataVersionStatus } from '@/manager/services/apiServiceUtils'
import { DATA_VERSION } from '@/version'
import { confirmDiscardChanges } from '@/editor/helpers/confirmDiscardChanges'

export function useLoadActions(state: DataManagerType, handleAsyncAction: AsyncActionHandler) {
  // 設定読み込み
  const applyConfigFile = async (fileName: string) => {
    const omikujiStore = useOmikujiStore()
    const navigationStore = useNavigationStore()
    // アプリ未対応の新しい dataVersion は読み込まない(一覧の無効化に頼らない)
    const file = state.availableFiles.value.find((f) => f.name === fileName)
    if (file?.meta && getDataVersionStatus(file.meta.dataVersion) === 'unsupported') {
      swalToast.error({
        title: t('manager.messages.unsupportedData'),
        text: t('manager.messages.unsupportedDataText', { fileVersion: file.meta.dataVersion, appVersion: DATA_VERSION }),
      })
      return null
    }

    // 変更があるなら確認ダイアログ
    if (!(await confirmDiscardChanges(omikujiStore.hasChanged))) return null

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
