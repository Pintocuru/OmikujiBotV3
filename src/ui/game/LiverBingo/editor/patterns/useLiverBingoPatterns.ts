// src/ui/game/LiverBingo/editor/patterns/useLiverBingoPatterns.ts
import { computed, ref, watch, type Ref } from 'vue'
import type { LiverBingoPatternContentType, LiverBingoPatternInfoType, LiverBingoPatternType } from '@/types/ui'
import { createLocalRepository, createServerRepository, type PatternRepository } from './patternRepository'

/** パターンの ID を作る(ファイル名に使うので、英数字だけ) */
export const createPatternId = () => `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

/**
 * 保存パターンの一覧・保存・読み込み・削除
 * - isServer が true ならサーバー、false ならこのブラウザ(localStorage)に保存する
 * - 保存先が切り替わったら、一覧を読み直す
 * - 失敗したときは、error に画面向けの種類を入れる(原因はコンソールに出す)
 */
export const useLiverBingoPatterns = (isServer: Ref<boolean>) => {
  const patterns = ref<LiverBingoPatternInfoType[]>([])
  const loading = ref(false)
  /** 直近の操作の失敗(null = 失敗なし) */
  const error = ref<'list' | 'save' | 'load' | 'remove' | null>(null)

  const repository = computed<PatternRepository>(() =>
    isServer.value ? createServerRepository() : createLocalRepository()
  )

  const run = async <T>(kind: NonNullable<typeof error.value>, task: () => Promise<T>): Promise<T | null> => {
    error.value = null
    try {
      return await task()
    } catch (e) {
      console.error(`[useLiverBingoPatterns] ${kind} failed`, e)
      error.value = kind
      return null
    }
  }

  const refresh = async () => {
    loading.value = true
    const list = await run('list', () => repository.value.list())
    if (list) patterns.value = list
    else patterns.value = []
    loading.value = false
  }

  watch(isServer, refresh, { immediate: true })

  /** 保存する。id を渡すと上書き、省略すると新しいパターンとして保存する。成功したら true */
  const save = async (name: string, content: LiverBingoPatternContentType, id: string = createPatternId()) => {
    const done = await run('save', async () => {
      await repository.value.save({ ...content, id, name: name.trim() })
      return true
    })
    if (done) await refresh()
    return done === true
  }

  /** 中身を読み込む(読めなければ null) */
  const load = async (id: string): Promise<LiverBingoPatternType | null> => {
    const pattern = await run('load', () => repository.value.load(id))
    if (!pattern && !error.value) error.value = 'load' // 見つからなかった
    return pattern
  }

  const remove = async (id: string) => {
    const done = await run('remove', async () => {
      await repository.value.remove(id)
      return true
    })
    if (done) await refresh()
    return done === true
  }

  return { patterns, loading, error, refresh, save, load, remove }
}
