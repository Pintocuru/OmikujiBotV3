// src/console/game/OshikuraChain/scripts/autoComment.ts
// コメントオートモード: 実コメントの代わりに、ゲーム内の時計で一定間隔ごとに架空のコメントを入れる (純粋関数。投稿者と本文は外から渡す)
import type { SpawnRequest } from './oshikuraChainEngine'

/**
 * clock (ゲーム内の時計の秒) までに来ているコメントを、間隔ごとに作る
 * - 到着時刻 (atSeconds) は、きっちり nextAt + 間隔 × n。フレームが粗くても、間隔はずれない
 * - 戻り値の nextAt は、次に入れる時刻。呼び出し側が覚えておく
 */
export const collectAutoSpawns = (
  nextAt: number,
  clock: number,
  intervalSeconds: number,
  make: (atSeconds: number) => SpawnRequest
): { spawns: SpawnRequest[]; nextAt: number } => {
  const spawns: SpawnRequest[] = []
  if (!(intervalSeconds > 0)) return { spawns, nextAt }
  let at = nextAt
  while (at <= clock + 1e-9) {
    spawns.push(make(at))
    at += intervalSeconds
  }
  return { spawns, nextAt: at }
}
