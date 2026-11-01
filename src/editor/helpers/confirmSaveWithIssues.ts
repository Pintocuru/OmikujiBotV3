// src/editor/helpers/confirmSaveWithIssues.ts
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
import { summarizeParseIssues } from '@/types/core/ParseIssues'
import i18n from '@/editor/i18n'

const t = (key: string, named?: Record<string, unknown>) =>
  named ? i18n.global.t(key, named) : i18n.global.t(key)

/**
 * 保存・出力の前に確認する。
 * 読み込み時に除外した要素がある場合、保存すると除外した要素は保存先から消える。
 * 問題なし(issues なし)なら確認を出さず true を返す。
 */
export async function confirmSaveWithIssues(): Promise<boolean> {
  const { loadIssues } = useOmikujiStore()
  if (loadIssues.length === 0) return true

  const { total, byCategory } = summarizeParseIssues(loadIssues)
  const rows = Object.entries(byCategory)
    .map(([category, count]) => {
      const countText = t(`saveIssues.count.${count === 1 ? 'one' : 'other'}`, { count })
      return `<li>${category}: ${countText}</li>`
    })
    .join('')
  const result = await swalModal.confirm({
    icon: 'warning',
    title: t(`saveIssues.title.${total === 1 ? 'one' : 'other'}`, { count: total }),
    html: `
      <p>${t('saveIssues.description')}</p>
      <ul style="text-align:left; margin:8px auto; display:table;">${rows}</ul>
      <p style="font-size:0.85em; color:#666;">${t('saveIssues.recommendation')}</p>
    `,
    confirmButtonText: t('saveIssues.confirm'),
  })
  return result.isConfirmed
}
