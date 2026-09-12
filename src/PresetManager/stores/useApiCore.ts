// src/PresetManager/stores/useApiCore.ts
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
import { DevConfigStateType } from '@/PresetManager/types'

export type AsyncActionHandler = <T>(
  action: () => Promise<T>,
  loadingKey: keyof DevConfigStateType
) => Promise<T | null>

export function useApiCore(state: DevConfigStateType) {
  // 非同期アクションのラッパー
  const handleAsyncAction = async <T>(
    action: () => Promise<T>,
    loadingKey: keyof DevConfigStateType
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
      const message = `${err.message}\n開発サーバーが起動していることを確認してください。`
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
