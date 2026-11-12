// src/common/UnusedUiSettings.ts
import type { OmikujiDataType, UiKind } from '@/types/OmikujiData'
import { uiLayoutMap } from '@/maps/OmikujiData'

/**
 * 設定が入っていて、現在のレイアウトが使わない UI の一覧
 * (エディターの手動削除と、ビルド時の自動削除で共用する)
 */
export const findUnusedUiKinds = (ui: OmikujiDataType['ui'] | undefined): UiKind[] => {
  // ビルドでは zod を通る前の生 JSON が来るため、ui / settings が無い場合も考慮する
  if (!ui?.settings) return []
  const used = uiLayoutMap[ui.layout]
  if (!used) return [] // 未知のレイアウトでは何も消さない
  return (Object.keys(ui.settings) as UiKind[]).filter(
    (kind) => ui.settings[kind] !== undefined && !used.includes(kind)
  )
}

/**
 * 余計な UI 設定を除いた data を返す(元の data は書き換えない)
 */
export const pruneUnusedUiSettings = (data: OmikujiDataType): OmikujiDataType => {
  const unused = findUnusedUiKinds(data.ui)
  if (unused.length === 0) return data

  const settings = { ...data.ui.settings }
  for (const kind of unused) delete settings[kind]
  return { ...data, ui: { ...data.ui, settings } }
}
