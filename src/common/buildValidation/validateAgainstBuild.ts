// src/common/buildValidation/validateAgainstBuild.ts
import { uiKinds, isGameScriptKey, type OmikujiDataType } from '@/types/OmikujiData'
import { getLayoutLoader, getUiLoader } from '@/ui/uiRegistry'
import { getGameScriptLoader } from '@/games/gameScriptRegistry'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { postSystemMessage } from '@/sdk/post/PostOneComme'

/**
 * ビルド未対応データの検証
 * - registerAll() などで登録されていない UI / レイアウト / gameScript をデータが使っていないかを調べる
 */

type UnsupportedKeyType = 'ui' | 'layout' | 'gameScript'
export type UnsupportedKey = { type: UnsupportedKeyType; key: string }

const typeLabel: Record<UnsupportedKeyType, string> = {
  ui: 'UI',
  layout: 'レイアウト',
  gameScript: 'gameScript',
}

/** 「UI: xxx、レイアウト: yyy」形式の一覧文字列 */
const formatUnsupportedKeys = (items: UnsupportedKey[]): string =>
  items.map(({ type, key }) => `${typeLabel[type]}: ${key}`).join('、')

/** ユーザー向けの「データ不一致」文言 */
export const formatBuildMismatchMessage = (items: UnsupportedKey[]): string =>
  `このデータは、このビルドで未対応の機能(${formatUnsupportedKeys(items)})を含んでいます。対応するビルドで開いてください`

/** データ内の postFlow(kind: 'gameScript')から scriptId を集める。assets 配下のどこにあっても拾える */
const collectGameScriptIds = (node: unknown, found: Set<string>): void => {
  if (Array.isArray(node)) {
    node.forEach((child) => collectGameScriptIds(child, found))
    return
  }
  if (node === null || typeof node !== 'object') return

  const record = node as Record<string, unknown>
  if (record.kind === 'gameScript' && typeof record.scriptId === 'string' && record.scriptId) {
    found.add(record.scriptId)
  }
  Object.values(record).forEach((child) => collectGameScriptIds(child, found))
}

/**
 * データが、このビルドで未登録のキーを使っていないか検証する
 * @returns 未対応キーの一覧(空配列なら問題なし)
 */
export const validateAgainstBuild = (data: OmikujiDataType): UnsupportedKey[] => {
  const unsupported: UnsupportedKey[] = []

  // UI 種別: src/types の uiKinds から列挙。settings に設定がある種別だけが「使用中」
  for (const kind of uiKinds) {
    if (data.ui.settings[kind] && !getUiLoader(kind)) unsupported.push({ type: 'ui', key: kind })
  }

  // レイアウト
  const { layout } = data.ui
  if (layout && !getLayoutLoader(layout)) unsupported.push({ type: 'layout', key: layout })

  // gameScript: scriptId は文字列なので、gameScriptKeys にない値も未対応として扱う
  const scriptIds = new Set<string>()
  collectGameScriptIds(data.assets, scriptIds)
  for (const scriptId of scriptIds) {
    if (!isGameScriptKey(scriptId) || !getGameScriptLoader(scriptId)) {
      unsupported.push({ type: 'gameScript', key: scriptId })
    }
  }

  return unsupported
}

/**
 * 「データ不一致」エラー
 * - 実行時の保険(ローダーの動的 import 失敗など)で投げ、画面側が同じ表示に流せるようにする
 */
export class BuildMismatchError extends Error {
  readonly unsupported: UnsupportedKey[]

  constructor(unsupported: UnsupportedKey[]) {
    super(formatBuildMismatchMessage(unsupported))
    this.name = 'BuildMismatchError'
    this.unsupported = unsupported
  }
}

type ReportOptions = {
  /** modal: 読み込み拒否など / toast: 実行中(OBS 表示など)で画面を塞がない */
  display?: 'modal' | 'toast'
  /** わんコメへの連続投稿を抑える(3秒に1回) */
  throttle?: boolean
}

/**
 * 「データ不一致」を画面に表示し、わんコメにもシステムメッセージとして投稿する
 * (わんコメへの投稿はコンソールエラーの代わりを兼ねる)
 */
export const reportDataMismatch = (
  items: UnsupportedKey[],
  { display = 'modal', throttle = false }: ReportOptions = {}
) => {
  const text = formatBuildMismatchMessage(items)
  const title = 'データが不一致です'

  if (display === 'toast') swalToast.error({ title, text })
  else swalModal.error({ title, text })

  // わんコメに接続できない環境では失敗するため、握りつぶす(画面表示は済んでいる)
  postSystemMessage(`❌ ${title}: ${text}`, { throttle }).catch(() => {
    // 接続できない環境では通知に失敗しても無視する
  })
}
