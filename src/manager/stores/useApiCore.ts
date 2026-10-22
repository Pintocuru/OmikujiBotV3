// src/manager/stores/useApiCore.ts
import { DataManagerType } from '@/manager/types'
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

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
      const message = `${err.message}\nサーバーが起動していることを確認してください。`
      swalModal.error({ title: '接続エラー', text: message })
      return null
    } finally {
      target.value = false
    }
  }

  return {
    handleAsyncAction,
  }
}
