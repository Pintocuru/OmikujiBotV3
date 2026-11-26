// src/console/control/Amidakuji/composables/useLadderRungs.ts
// 横線 (手動・自動) の状態。人数や行数が変わったら、範囲外の横線を自動で除く
import { computed, ref, watch, type Ref } from 'vue'
import { DEFAULT_RUNG_DENSITY } from '../scripts/amidakujiConstants'
import { canPlaceRung, generateAutoRungs, type Rung } from '../scripts/ladder'
import { pruneRungs } from '../scripts/rungs'

export function useLadderRungs(colCount: Ref<number>, rowCount: Ref<number>) {
  const manualRungs = ref<Rung[]>([])
  const autoRungs = ref<Rung[]>([])
  const rungDensity = ref(DEFAULT_RUNG_DENSITY)

  const allRungs = computed<Rung[]>(() => [...manualRungs.value, ...autoRungs.value])

  const same = (r: Rung, col: number, row: number) => r.col === col && r.row === row

  /** 横線を置く (on=true) / 消す (on=false)。置けない場所は何もしない。変わったら true */
  const setRung = (col: number, row: number, on: boolean): boolean => {
    const exists = allRungs.value.some((r) => same(r, col, row))
    if (!on) {
      if (!exists) return false
      manualRungs.value = manualRungs.value.filter((r) => !same(r, col, row))
      autoRungs.value = autoRungs.value.filter((r) => !same(r, col, row))
      return true
    }
    if (exists || !canPlaceRung(allRungs.value, col, row, colCount.value, rowCount.value)) return false
    manualRungs.value = [...manualRungs.value, { col, row }]
    return true
  }

  // 手動の横線を残したまま、空きに自動で足す (自動分は作り直す)
  const generateAuto = () => {
    const generated = generateAutoRungs(manualRungs.value, colCount.value, rowCount.value, rungDensity.value)
    autoRungs.value = generated.filter((r) => !manualRungs.value.some((m) => same(m, r.col, r.row)))
  }

  const resetAutoRungs = () => {
    autoRungs.value = []
  }

  const resetAllRungs = () => {
    manualRungs.value = []
    autoRungs.value = []
  }

  // 人数・行数の変化で、範囲外になった横線を除く (範囲外が残ると、辿った先がゴールの外になる)
  watch([colCount, rowCount], ([cols, rows]) => {
    manualRungs.value = pruneRungs(manualRungs.value, cols, rows)
    autoRungs.value = pruneRungs(autoRungs.value, cols, rows)
  })

  return {
    manualRungs,
    autoRungs,
    allRungs,
    rungDensity,
    setRung,
    generateAuto,
    resetAutoRungs,
    resetAllRungs,
  }
}
