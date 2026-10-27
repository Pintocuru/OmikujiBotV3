// server/core/utils/mutex.ts

const tails = new Map<string, Promise<unknown>>()

/**
 * 同じ key の処理を直列に実行する
 * (読み込み → 変更 → 保存 の途中で、別のリクエストに割り込まれないようにする)
 */
export function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = tails.get(key) ?? Promise.resolve()
  const run = previous.catch(() => undefined).then(fn)

  const tail = run.catch(() => undefined)
  tails.set(key, tail)
  void tail.then(() => {
    if (tails.get(key) === tail) tails.delete(key)
  })

  return run
}
