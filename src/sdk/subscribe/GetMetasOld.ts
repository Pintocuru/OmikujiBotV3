// shared/sdk/subscribe/GetMetasOld.ts
import { api } from '../../http/client'
import { PingOneSDK } from '../connection/PingOneSDK'
import { Service, ServiceMeta } from '@onecomme.com/onesdk/types/Service'

/**
 * メタ情報フェッチャーを生成するファクトリ関数
 * @param num - 複数ライブがある場合に、何番目のライブを使うか（インデックス）
 */
export function createGetMetas(num: number = 0) {
  // 現在のメタ情報のキャッシュ
  let metaCache: ServiceMeta | null = null

  // ポーリング用のタイマーID
  let pollingInterval: ReturnType<typeof setInterval> | null = null

  // PingOneSDK の初期化チェックフラグ（1度だけ行う）
  let isInitialized = false

  /**
   * ライブ配信中のメタ情報を取得
   */
  const fetchLiveMeta = async (): Promise<ServiceMeta | null> => {
    try {
      const services = await api.get<Service[]>('/services').then((r) => r.data)
      const liveServices = services?.filter((s) => s.meta?.isLive) || []
      return liveServices[num]?.meta ?? null
    } catch (error) {
      console.error('Error fetching meta data:', error)
      return null
    }
  }

  /**
   * ポーリングを開始（3秒ごとに最新のメタ情報を取得）
   */
  const startPolling = (callback: (meta: ServiceMeta | null) => void) => {
    stopPolling() // 既存のポーリングがあれば停止

    pollingInterval = setInterval(() => {
      fetchLiveMeta()
        .then((meta) => {
          metaCache = meta
          callback(meta)
        })
        .catch((err) => {
          console.error('Polling error:', err)
        })
    }, 3000)
  }

  /**
   * ポーリングを停止
   */
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  /**
   * メタ情報の取得を開始（必要であれば PingOneSDK を初期化）
   */
  const fetchMeta = async (callback: (meta: ServiceMeta | null) => void): Promise<boolean> => {
    if (!isInitialized) {
      const ok = await PingOneSDK()
      if (!ok) return false
      isInitialized = true
    }

    startPolling(callback)
    return true
  }

  /**
   * 現在キャッシュされているメタ情報を取得
   */
  const getCurrentMeta = (): ServiceMeta | null => metaCache

  return { fetchMeta, stopPolling, getCurrentMeta }
}
