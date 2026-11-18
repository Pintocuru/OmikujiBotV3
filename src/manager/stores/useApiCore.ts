// src/manager/stores/useApiCore.ts
import { DataManagerType } from '@/manager/types'
import { dialog } from '@/common/Dialog/dialogState'
import { ConnectionError } from '@/manager/services/baseApiClient'
import i18n from '@/i18n/editorI18n'

const t = (key: string) => i18n.global.t(key)

export type AsyncActionHandler = <T>(action: () => Promise<T>, loadingKey: keyof DataManagerType) => Promise<T | null>

export function useApiCore(state: DataManagerType) {
  // 非同期アクションのラッパー
  const handleAsyncAction = async <T>(
    action: () => Promise<T>,
    loadingKey: keyof DataManagerType
  ): Promise<T | null> => {
    const target = state[loadingKey]
    if (!('value' in target)) {
      throw new Error(`Invalid loading key: ${loadingKey}`)
    }

    target.value = true
    try {
      return await action()
    } catch (error) {
      const err = error as Error
      if (err instanceof ConnectionError) {
        void dialog.alert({
          tone: 'error',
          title: t('manager.messages.connectionError'),
          text: `${err.message}
サーバーが起動していることを確認してください。`,
        })
      } else {
        void dialog.alert({ tone: 'error', title: t('manager.messages.error'), text: err.message })
      }
      return null
    } finally {
      target.value = false
    }
  }

  return {
    handleAsyncAction,
  }
}
