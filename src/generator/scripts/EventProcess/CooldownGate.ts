// src/generator/scripts/EventProcess/CooldownGate.ts

/**
 * cooldownSeconds による実行制限。
 * 直前に実行されたシナリオ(1件)の cooldownSeconds と実行時刻だけを保持し、後続の実行可否を判定する。
 * OmikujiProcessor は都度 new されるため、状態はモジュールスコープで共有する。
 */
let last: { seconds: number; at: number; label: string } | null = null

/**
 * 実行済み(previous)のシナリオが、後続(next)のシナリオを時間内にブロックしうるか。経過時間は考慮しない。
 * エディターの一覧表示(止められる件数)と判定式を共有するために切り出している。
 */
export function canCooldownBlock(previous: number, next: number): boolean {
  return previous !== 0 && next < previous
}

/**
 * ブロックされた理由。通知・ログ用
 * - remainingSeconds: 直前のシナリオの制限が解けるまでの残り秒
 * - blockedBy: 直前に実行されたシナリオ(label は表示用の名前)
 */
export type CooldownBlock = { remainingSeconds: number; blockedBy: { label: string; seconds: number } }
export type CooldownResult = { allowed: true } | ({ allowed: false } & CooldownBlock)

/**
 * 実行可否を判定し、通過なら今回の cooldownSeconds・名前・時刻を記録する。
 * ブロックされた場合は記録を更新しない。
 * ブロック条件: 経過秒 < |S| かつ N < S (S: 直前の値 / N: 今回の値。undefined は 0 扱い)
 * 戻り値が boolean でないのは、呼び出し側が「なぜ止まったか」を通知・ログに使うため。
 */
export function acquireCooldown(
  cooldownSeconds: number | undefined,
  label: string,
  now: number = Date.now()
): CooldownResult {
  const n = cooldownSeconds ?? 0
  if (last) {
    const elapsed = (now - last.at) / 1000
    if (elapsed < Math.abs(last.seconds) && canCooldownBlock(last.seconds, n)) {
      return {
        allowed: false,
        remainingSeconds: Math.abs(last.seconds) - elapsed,
        blockedBy: { label: last.label, seconds: last.seconds },
      }
    }
  }
  last = { seconds: n, at: now, label }
  return { allowed: true }
}
