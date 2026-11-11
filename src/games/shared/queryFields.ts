// src/games/shared/queryFields.ts
import type { GameInputField } from '@/games/types'

/**
 * queryString と入力欄の相互変換
 *
 * URLSearchParams#toString は使わない。
 * [[変数名]] や <<userId>> が % エンコードされ、実行前の置換が効かなくなるため。
 * 必要最小限(% & = +)だけエスケープして、日本語・[[ ]]・<< >> はそのまま残す。
 */

const escapeValue = (value: string): string =>
  value.replace(/%/g, '%25').replace(/&/g, '%26').replace(/=/g, '%3D').replace(/\+/g, '%2B')

export interface ParsedQueryFields {
  values: Record<string, string> // 宣言済みキーの値
  extra: string // 宣言にないキー(元の文字列のまま保持)
}

export function parseQueryFields(queryString: string, inputs: readonly GameInputField[]): ParsedQueryFields {
  const declared = new Set(inputs.map((input) => input.key))
  const values: Record<string, string> = {}
  const extra: string[] = []

  for (const piece of queryString.split('&')) {
    if (!piece) continue
    const [key, value] = [...new URLSearchParams(piece).entries()][0] ?? ['', '']
    if (declared.has(key)) values[key] = value
    else extra.push(piece)
  }
  return { values, extra: extra.join('&') }
}

export function buildQueryString(
  values: Record<string, string>,
  extra: string,
  inputs: readonly GameInputField[]
): string {
  const pieces = inputs
    .filter((input) => (values[input.key] ?? '') !== '')
    .map((input) => `${input.key}=${escapeValue(values[input.key])}`)
  if (extra) pieces.push(extra)
  return pieces.join('&')
}
