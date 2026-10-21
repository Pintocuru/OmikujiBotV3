// src/common/buildValidation/guardedAsyncComponent.ts
import { defineAsyncComponent, type Component } from 'vue'
import DataMismatchNotice from './DataMismatchNotice.vue'
import { BuildMismatchError, type UnsupportedKey } from './validateAgainstBuild'

/**
 * defineAsyncComponent に「データ不一致」表示の保険を付ける
 * - 動的 import の失敗は BuildMismatchError にして、errorComponent(DataMismatchNotice)に流す
 */
export const defineGuardedAsyncComponent = (loader: () => Promise<{ default: Component }>, target: UnsupportedKey) =>
  defineAsyncComponent({
    loader: async () => {
      try {
        return await loader()
      } catch {
        throw new BuildMismatchError([target])
      }
    },
    errorComponent: DataMismatchNotice,
    delay: 0,
  })
