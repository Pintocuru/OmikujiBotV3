// src/common/buildValidation/validateAgainstBuild.ts
import { uiKinds, isGameScriptKey, type OmikujiDataType, type UiKind } from '@/types/OmikujiData'
import { getLayoutLoader, getUiLoader } from '@/ui/uiRegistry'
import { getGameScriptLoader } from '@/games/gameScriptRegistry'
import { dialog } from '@/common/Dialog/dialogState'
import { notify } from '@/common/Notice/notify'
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
export type BuildMismatchTranslate = (key: string, values?: Record<string, string>) => string

export const formatBuildMismatchMessage = (items: UnsupportedKey[], translate?: BuildMismatchTranslate): string => {
  if (!translate) {
    return `このデータは、このビルドで未対応の機能(${formatUnsupportedKeys(items)})を含んでいます。対応するビルドで開いてください`
  }

  const key = 'uiSettings.common.buildMismatch'
  const details = items
    .map(({ type, key: itemKey }) => translate(`${key}.types.${type}`, { key: itemKey }))
    .join(translate(`${key}.separator`))
  return translate(`${key}.message`, { details })
}

/** データ内の step(kind: 'gameScript')から scriptKey を集める。assets 配下のどこにあっても拾える */
const collectGameScriptKeys = (node: unknown, found: Set<string>): void => {
  if (Array.isArray(node)) {
    node.forEach((child) => collectGameScriptKeys(child, found))
    return
  }
  if (node === null || typeof node !== 'object') return

  const record = node as Record<string, unknown>
  if (record.kind === 'gameScript' && typeof record.scriptKey === 'string' && record.scriptKey) {
    found.add(record.scriptKey)
  }
  Object.values(record).forEach((child) => collectGameScriptKeys(child, found))
}

/** データ内の step(kind: 'message')から uiKey を集める。assets 配下のどこにあっても拾える */
const collectUiKeys = (node: unknown, found: Set<string>): void => {
  if (Array.isArray(node)) {
    node.forEach((child) => collectUiKeys(child, found))
    return
  }
  if (node === null || typeof node !== 'object') return

  const record = node as Record<string, unknown>
  if (record.kind === 'message' && typeof record.uiKey === 'string' && record.uiKey) {
    found.add(record.uiKey)
  }
  Object.values(record).forEach((child) => collectUiKeys(child, found))
}

/**
 * データが、このビルドで未登録のキーを使っていないか検証する
 * @returns 未対応キーの一覧(空配列なら問題なし)
 */
export const validateAgainstBuild = (data: OmikujiDataType): UnsupportedKey[] => {
  const unsupported: UnsupportedKey[] = []

  // UI 種別: settings に設定がある種別だけが「使用中」
  for (const kind of Object.keys(data.ui.settings) as UiKind[]) {
    if (data.ui.settings[kind] && !getUiLoader(kind)) unsupported.push({ type: 'ui', key: kind })
  }

  // レイアウト
  const { layout } = data.ui
  if (layout && !getLayoutLoader(layout)) unsupported.push({ type: 'layout', key: layout })

  // シナリオステップで指定された UI 種別
  const uiKeys = new Set<string>()
  collectUiKeys(data.assets, uiKeys)
  for (const uiKey of uiKeys) {
    if (!getUiLoader(uiKey as UiKind) && !unsupported.some((u) => u.type === 'ui' && u.key === uiKey)) {
      unsupported.push({ type: 'ui', key: uiKey })
    }
  }

  // gameScript: scriptKey は文字列なので、gameScriptKeys にない値も未対応として扱う
  const scriptKeys = new Set<string>()
  collectGameScriptKeys(data.assets, scriptKeys)
  for (const scriptKey of scriptKeys) {
    if (!isGameScriptKey(scriptKey) || !getGameScriptLoader(scriptKey)) {
      unsupported.push({ type: 'gameScript', key: scriptKey })
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
  translate?: BuildMismatchTranslate
}

/**
 * 「データ不一致」を画面に表示し、わんコメにもシステムメッセージとして投稿する
 * (わんコメへの投稿はコンソールエラーの代わりを兼ねる)
 */
export const reportDataMismatch = (
  items: UnsupportedKey[],
  { display = 'modal', throttle = false, translate }: ReportOptions = {}
) => {
  const text = formatBuildMismatchMessage(items, translate)
  const title = translate?.('uiSettings.common.buildMismatch.title') ?? 'データが不一致です'

  // toast は実行中(OBS の配信画面など)の表示なので、配信画面向け(stage)に出す
  if (display === 'toast') notify.error(title, { text, scope: 'stage' })
  else void dialog.alert({ tone: 'error', title, text })

  // わんコメに接続できない環境では失敗するため、握りつぶす(画面表示は済んでいる)
  postSystemMessage(`❌ ${title}: ${text}`, { username: 'error', throttle }).catch(() => {
    // 接続できない環境では通知に失敗しても無視する
  })
}
