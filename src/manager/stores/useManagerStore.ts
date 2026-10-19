// src/manager/stores/useManagerStore.ts
import { defineStore } from 'pinia'
import { useManagerState } from './useManagerState'
import { useManagerActions } from './useManagerActions'
import { useManagerGetters } from './useManagerGetters'

export const useManagerStore = defineStore('devConfig', () => {
  // 状態管理
  const state = useManagerState()

  // アクション
  const actions = useManagerActions(state)

  // ゲッター
  const getters = useManagerGetters(state)

  return {
    ...state,
    ...getters,
    ...actions,
  }
})
