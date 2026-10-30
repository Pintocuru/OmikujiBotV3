// src/editor/helpers/confirmSaveWithIssues.ts
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
import { summarizeParseIssues } from '@/types/core/ParseIssues'

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
    .map(([category, count]) => `<li>${category}: ${count}件</li>`)
    .join('')
  const result = await swalModal.confirm({
    icon: 'warning',
    title: `読み込み時に ${total}件 除外しています`,
    html: `
      <p>このまま保存すると、除外した要素は保存先から消えます。</p>
      <ul style="text-align:left; margin:8px auto; display:table;">${rows}</ul>
      <p style="font-size:0.85em; color:#666;">元のファイルは、保存せずに残しておくことをおすすめします。</p>
    `,
    confirmButtonText: '除外したまま保存する',
  })
  return result.isConfirmed
}
