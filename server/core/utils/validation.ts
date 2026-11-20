// server/core/utils/validation.ts

/**
 * ファイル名のバリデーション（フォルダネスト対応）
 * presets 用: 半角英数・ハイフン・ドット・空白のみ
 */
export function validateFileName(fileName: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false
  }
  // .. によるパストラバーサル禁止
  if (fileName.includes('..')) {
    return false
  }
  // 各セグメントを検証
  const segments = fileName.split('/')
  const lastSegment = segments[segments.length - 1]

  // 最後のセグメントは .json で終わる必要がある
  if (!/^[\w\-. ]+\.json$/.test(lastSegment)) {
    return false
  }

  // 中間のフォルダ名を検証（空セグメント禁止）
  for (let i = 0; i < segments.length - 1; i++) {
    if (!/^[\w\-. ]+$/.test(segments[i])) {
      return false
    }
  }

  return true
}

/**
 * パッケージ用ファイル名のバリデーション（フラット・非ASCII許可）
 * meta.id は任意の文字列になり得るため、文字種ではなく
 * 「パス区切り・制御文字・.. を含まない .json 名」であることを検証する。
 */
export function validatePackageFileName(fileName: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false
  }
  if (fileName.includes('..') || /[/\\\0]/.test(fileName)) {
    return false
  }
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(fileName)) {
    return false
  }
  return fileName.length > '.json'.length && fileName.endsWith('.json')
}

/**
 * 文字列が JSON として読めるか
 * save 系は文字列をそのまま保存するため、壊れた JSON を保存して次の load が失敗するのを防ぐ
 */
export function isValidJson(text: string): boolean {
  if (typeof text !== 'string') return false
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}

export type SinceResult = { ok: true; value: number | undefined } | { ok: false }

/**
 * ポーリングの since (クエリ文字列) を読む
 * - 未指定・空文字 → value は undefined (「最初の問い合わせ」として扱う)
 * - 0 以上の整数 → その値
 * - それ以外 → ok: false (呼び出し側が 400 にする)
 */
export function parseSince(since: string | undefined): SinceResult {
  if (since === undefined || since.trim() === '') return { ok: true, value: undefined }
  const value = Number(since)
  if (!Number.isInteger(value) || value < 0) return { ok: false }
  return { ok: true, value }
}

/**
 * オブジェクトのキー (eventKey・userId など) に使える文字列か
 * '__proto__' は、zod の record が読み込み時に黙って捨てるため、保存しても消えてしまう。受け付けない
 */
export function isSafeRecordKey(key: string): boolean {
  return key !== '__proto__'
}
