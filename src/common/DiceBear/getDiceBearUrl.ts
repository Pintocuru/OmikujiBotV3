// src/common/DiceBear/getDiceBearUrl.ts
// DiceBear の HTTP API の URL を組み立てる (スタイル・種・オプション指定)。
// getAvatarUrl (9.x 固定。ユーザーのアバター用) とは別に持つ。9.x にないスタイル (initial-face / slice など) を使うため、10.x を使う。
// 10.x の URL は、今後も同じ絵を返すと公式が明記している

/** HTTP API のバージョン (10.x の URL は、今後も同じ絵を返す) */
export const DICEBEAR_API_VERSION = '10.x'

/** 色のオプションは、'#' なしの 16 進で渡す */
const stripHash = (value: string): string => (value.startsWith('#') ? value.slice(1) : value)

/**
 * @param style スタイル名 (例: 'icons')
 * @param seed 種。同じ種なら、いつも同じ絵になる
 * @param options 追加のオプション (例: { backgroundColor: '#e5484d' })。'#' で始まる値は '#' を外す
 */
export const getDiceBearUrl = (style: string, seed: string, options: Readonly<Record<string, string>> = {}): string => {
  const params = new URLSearchParams({ seed })
  for (const [key, value] of Object.entries(options)) params.set(key, stripHash(value))
  return `https://api.dicebear.com/${DICEBEAR_API_VERSION}/${style}/svg?${params.toString()}`
}
