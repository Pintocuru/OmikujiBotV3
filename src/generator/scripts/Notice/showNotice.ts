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
 * 同じ文言が続いた場合は 1 件にまとめて表示する。
 */
export function showErrorNotice(message: string): void {
  if (!useAppStore().data.settings.generator.showErrorNotice) return
  useNoticeStore().push(message, 'error')
}
