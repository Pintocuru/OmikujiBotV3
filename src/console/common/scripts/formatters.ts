// src/console/common/scripts/formatters.ts
// LiveConsole の各画面 (pads / users / games) で共通の、日時・数値の表示用の整形 (純粋関数)

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return '-'
  const d = new Date(timestamp)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export function formatTime(timestamp: number): string {
  return timestamp ? formatDateTime(timestamp).slice(11) : '-'
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ja-JP', { maximumFractionDigits: 2 })
}
