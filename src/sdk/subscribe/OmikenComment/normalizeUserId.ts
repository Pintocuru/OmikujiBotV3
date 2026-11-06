// src/sdk/subscribe/OmikenComment/normalizeUserId.ts
import { POST_SETTINGS } from '@/sdk/PostSettings'

/**
 * 文字列から 53bit のハッシュ値を作る (cyrb53)
 * 100 万ユーザーでも、同じ値になる確率は 1 万分の 1 程度。
 */
function hash53(text: string): number {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

/**
 * コメントの送り主の userId を、おみくじBOT内で使う userId に変換する
 *
 * - 半角の英数字 (先頭は u) だけになる。変数名や判定式の一部に、そのまま埋め込める。
 * - わんコメの userId とは異なる値になる (仕様)。ユーザー統計・判定式の変数・アイコン表記など、
 *   おみくじBOT内の userId は、すべてこの値で揃える。
 * - 取得元(service)も混ぜるので、サービスが違えば、同じ id でも別のユーザーになる。
 * - 同じ入力なら、いつも同じ値になる。
 * - おみくじBOT自身の投稿は、BOT かどうかの判定に使うため、変換しない。
 */
export function normalizeUserId(service: string, rawUserId: string): string {
  if (rawUserId === POST_SETTINGS.botUserId) return rawUserId
  return `u${hash53(`${service}:${rawUserId}`).toString(36)}`
}
