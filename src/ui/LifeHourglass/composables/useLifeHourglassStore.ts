// src/ui/LifeHourglass/composables/useLifeHourglassStore.ts
import { defineStore } from 'pinia'

/**
 * 命の砂時計のストア(仮実装: メモリ上の値だけ。サーバーなし。リロードで 0 に戻る)。
 *
 * UI 側は保存先を差し替えられるように、次の 2 操作だけに依存する:
 * - load(): 通算を読み込む(起動時に 1 回)
 * - add(n): 通算に n 粒を加算する(絶対値を書き込まない)
 *
 * 保存するのは「通算(累計)」と「今回の配信で得られた砂粒」だけ。器の名前は保存しない。
 * localStorage は使わない。API ができたら、この中身だけを差し替える
 * (将来は load / add の実装を Manager 側へ移す。インターフェースは維持)。
 */
export const useLifeHourglassStore = defineStore('lifeHourglass', {
  state: () => ({
    /** 通算(累計)の砂粒 */
    totalGrains: 0,
    /** 起動時(読み込み時)の通算。carryOver=false で今回ぶんだけ表示するための基準 */
    baselineGrains: 0,
    /** 永続化できる保存先か。できない環境では carryOver のトグルを無効にする */
    isPersistent: false,
    /** load() を実行したか */
    loaded: false,
  }),
  getters: {
    /** 今回の配信ぶんの砂粒(通算 − 起動時の基準) */
    displayedGrains: (state) => Math.max(0, state.totalGrains - state.baselineGrains),
  },
  actions: {
    /** 通算を読み込む(起動時に 1 回) */
    async load() {
      // 仮実装: サーバーがないため常に 0。ここを API 呼び出しに差し替える
      this.totalGrains = 0
      this.baselineGrains = this.totalGrains
      this.loaded = true
    },
    /** 通算に n 粒を加算する(絶対値を書き込まない) */
    async add(n: number) {
      if (!Number.isFinite(n) || n <= 0) return
      this.totalGrains += Math.floor(n)
    },
  },
})
