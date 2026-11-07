// src/manager/stores/useManagerActions.ts
import { DataManagerType } from '@/manager/types'
import { useApiCore } from './useApiCore'
import { useFileActions } from './useApiFileActions'
import { useSaveActions } from './useApiSaveActions'
import { useLoadActions } from './useApiLoadActions'
import { configApi } from '@/manager/services/configApi'
import { isDev } from '@/common/AppEnv'

export function useManagerActions(state: DataManagerType) {
  const { handleAsyncAction } = useApiCore(state)
  const fileActions = useFileActions(state, handleAsyncAction)
  const saveActions = useSaveActions(state, handleAsyncAction)
  const loadActions = useLoadActions(state, handleAsyncAction)

  const setSaveFileName = (name: string = '') => {
    state.saveFileName.value = name
  }

  // サーバモード切り替え
  const toggleExpressMode = async (): Promise<boolean> => {
    if (!isDev) return false

    // 切り替え先に繋がらなければ元に戻す (現在のサーバーではなく、切り替え先の health を見る)
    configApi.toggleApiMode()
    if (!(await configApi.getHealth())) {
      configApi.toggleApiMode()
      return false
    }

    return true
  }

  return {
    ...fileActions,
    ...saveActions,
    ...loadActions,
    toggleExpressMode,
    setSaveFileName,
  }
}
