// src/generator/scripts/Notice/showNotice.ts
// 配信画面の右下の通知(NoticeWidget)を出す関数
import { useAppStore } from '@/generator/stores/useAppStore'
import { useNoticeStore } from '@/generator/stores/useNoticeStore'

/**
 * クールダウンでブロックされたことを知らせる。
 * 残り秒は 0.1 秒単位に切り上げる(「あと0.0秒」にならないようにするため)
 */
export function showCooldownBlockNotice(userName: string, remainingSeconds: number): void {
  if (!useAppStore().data.settings.generator.showCooldownNotice) return
  const seconds = (Math.ceil(remainingSeconds * 10) / 10).toFixed(1)
  useNoticeStore().push(`${userName}がブロックされました(あと${seconds}秒)`, 'cooldown')
}

/**
 * 実行時のエラーを知らせる(読み上げもわんコメへの投稿もしない)。
 * 設定で切り替えず、常に表示する(何も出ないまま止まるより、気づけるほうがよいため)。
 * 同じ文言が続いた場合は 1 件にまとめて表示する。
 * 繰り返し起きうるエラーはこちらを使う。1 回しか起きないエラーは postSystemMessage で伝える。
 */
export function showErrorNotice(message: string): void {
  useNoticeStore().push(message, 'error')
}

/**
 * 例外を、通知に出す短い文字列にする
 */
export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
