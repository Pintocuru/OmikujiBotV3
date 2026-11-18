// src/editor/helpers/confirmSaveWithIssues.ts
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { dialog } from '@/common/Dialog/dialogState'
import { summarizeParseIssues } from '@/types/core/ParseIssues'
import i18n from '@/i18n/editorI18n'

const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))

/**
 * 保存・出力の前に確認する。
 * 読み込み時に除外した要素がある場合、保存すると除外した要素は保存先から消える。
 * 問題なし(issues なし)なら確認を出さず true を返す。
 */
export async function confirmSaveWithIssues(): Promise<boolean> {
  const { loadIssues } = useOmikujiStore()
  if (loadIssues.length === 0) return true

  const { total, byCategory } = summarizeParseIssues(loadIssues)
  const items = Object.entries(byCategory).map(([category, count]) => {
    const countText = t(`saveIssues.count.${count === 1 ? 'one' : 'other'}`, { count })
    return `${category}: ${countText}`
  })
  return dialog.confirm({
    tone: 'warning',
    title: t(`saveIssues.title.${total === 1 ? 'one' : 'other'}`, { count: total }),
    text: t('saveIssues.description'),
    items,
    note: t('saveIssues.recommendation'),
    confirmLabel: t('saveIssues.confirm'),
  })
}
