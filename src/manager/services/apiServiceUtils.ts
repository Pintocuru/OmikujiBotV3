// src/manager/services/apiServiceUtils.ts
import { FileItem } from '@/manager/types'
import type { ApiActionName } from '@server/api/actions'

/**
 * 日付文字列をフォーマットする
 */
export const formatFileDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

// 日付のファイル名を返す
export const generateDateFileName = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return `config_${year}${month}${day}_${hour}${minute}${second}`
}

// 型定義
export interface NormalizedResponse<T> {
  code: number
  data: T
}

/**
 * APIレスポンスを正規化
 */
export function normalizeApiResponse<T>(raw: any): NormalizedResponse<T> {
  if (raw && typeof raw === 'object' && 'code' in raw && 'response' in raw) {
    return { code: raw.code, data: JSON.parse(raw.response) as T }
  }

  // codeだけある場合（エラーレスポンス）
  if (raw && typeof raw === 'object' && 'code' in raw) {
    return { code: raw.code, data: null as T }
  }

  throw new Error('APIレスポンス形式が不正です')
}

/**
 * ファイル名に .json 拡張子を確実に付与
 */
export function ensureJsonExtension(fileName: string): string {
  return fileName.endsWith('.json') ? fileName : `${fileName}.json`
}

/**
 * エラーメッセージマップ (アクション追加時の書き忘れを型で検出する)
 */
const ERROR_MESSAGES: Record<ApiActionName, string> = {
  health: 'サーバーの接続確認に失敗しました',
  list: 'ファイル一覧の取得に失敗しました',
  load: '設定の読み込みに失敗しました',
  'load-generator': '設定の読み込みに失敗しました',
  move: '設定ファイルの移動に失敗しました',
  save: '設定の保存に失敗しました',
  delete: '設定ファイルの削除に失敗しました',
  'save-generator': 'ジェネレーター設定の保存に失敗しました',
  'save-omikuji': 'おみくじデータの保存に失敗しました',
  'list-game-states': 'ゲームステート一覧の取得に失敗しました',
  'load-game-state': 'ゲームステートの読み込みに失敗しました',
  'append-game-log': 'ゲームログの追記に失敗しました',
  'delete-game-state': 'ゲームステートの削除に失敗しました',
  'load-user-stats': 'ユーザー統計の取得に失敗しました',
  'update-user-stats': 'ユーザー統計の更新に失敗しました',
  'reset-user-stats': 'ユーザー統計のリセットに失敗しました',
  'load-users': 'ユーザーリストの取得に失敗しました',
  'add-manual-user': 'ユーザーの追加に失敗しました',
  'remove-manual-user': 'ユーザーの削除に失敗しました',
  'reset-users': 'ユーザーリストのリセットに失敗しました',
}

/**
 * アクション名からエラーメッセージを取得
 */
export function getErrorMessage(action: string | undefined, status: number): string {
  const message = action ? (ERROR_MESSAGES as Record<string, string>)[action] : undefined
  return message ? `${message} (${status})` : `APIリクエストに失敗しました (${status})`
}

/**
 * APIのレスポンスをファイルアイテムに変換
 */
export function toFileItem(raw: { name: string; modified: string }): FileItem {
  const parts = raw.name.split('/')
  const displayName = parts[parts.length - 1].replace(/\.json$/, '')
  const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : null
  return {
    name: raw.name,
    displayName,
    folder,
    modified: raw.modified,
  }
}
