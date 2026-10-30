// src/common/ParseIssues/logParseIssues.ts
import { formatParseIssuesSummary, ParseIssue } from '@/types/core/ParseIssues'

/** 除外した要素・既定値に戻したフィールドをコンソールに出す (エラー表示・読み込み停止はしない) */
export function logParseIssues(source: string, issues: readonly ParseIssue[]): void {
  if (issues.length === 0) return
  console.groupCollapsed(`⚠️ [${source}] ${formatParseIssuesSummary(issues)}`)
  for (const issue of issues) {
    const where = [...issue.path, issue.key].filter((k) => k !== '').join(' > ')
    console.warn(`${issue.category} [${where}] ${issue.action === 'dropped' ? '除外' : '既定値に戻した'}: ${issue.reason}`, issue.raw)
  }
  console.groupEnd()
}
