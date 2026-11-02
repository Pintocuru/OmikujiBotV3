// src/generator/scripts/EventProcess/CooldownGate.ts

/**
 * cooldownSeconds による実行制限。
 * 直前に実行されたシナリオ(1件)の cooldownSeconds と実行時刻だけを保持し、後続の実行可否を判定する。
 * OmikujiProcessor は都度 new されるため、状態はモジュールスコープで共有する。
 */
let last: { seconds: number; at: number } | null = null

/**
 * 実行済み(previous)のシナリオが、後続(next)のシナリオを時間内にブロックしうるか。経過時間は考慮しない。
 * エディターの一覧表示(止められる件数)と判定式を共有するために切り出している。
 */
export function canCooldownBlock(previous: number, next: number): boolean {
  return previous !== 0 && next < previous
}

/**
 * 実行可否を判定し、通過なら今回の cooldownSeconds と時刻を記録する。
 * ブロックされた場合は記録を更新しない。
 * ブロック条件: 経過秒 < |S| かつ N < S (S: 直前の値 / N: 今回の値。undefined は 0 扱い)
 */
export function tryAcquireCooldown(cooldownSeconds: number | undefined, now: number = Date.now()): boolean {
  const n = cooldownSeconds ?? 0
  if (last) {
    const elapsed = (now - last.at) / 1000
    if (elapsed < Math.abs(last.seconds) && canCooldownBlock(last.seconds, n)) return false
  }
  last = { seconds: n, at: now }
  return true
}
