// src/common/Notice/notify.ts
// 通知(トースト)を出す API。title は必須(既定の文言は持たない)
// 例: notify.success(t('...')) / notify.error(t('...'), { text: String(error) })
import { pushNotice, type NoticeAction, type NoticeKind, type NoticeScope } from './noticeState'

export type NotifyOptions = {
  /** タイトルの下に出す補足 */
  text?: string
  /** 表示時間(ミリ秒) */
  durationMs?: number
  /** 通知につけるボタン(例: 更新の通知から GitHub を開く) */
  action?: NoticeAction
  /** 配信画面に出すときだけ 'stage' */
  scope?: NoticeScope
}

const make =
  (kind: NoticeKind) =>
  (title: string, options: NotifyOptions = {}): number =>
    pushNotice({ kind, title, ...options })

export const notify = {
  success: make('success'),
  warning: make('warning'),
  error: make('error'),
  info: make('info'),
}
