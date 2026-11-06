// src/common/escapeHtml.ts

/** HTML に埋め込む文字列をエスケープする(SweetAlert2 の html / title に任意の文字列を入れるとき用) */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
