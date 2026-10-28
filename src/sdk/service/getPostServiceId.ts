// src/sdk/service/getPostServiceId.ts
import { ServiceMetaWatcher } from '@/sdk/subscribe/GetServiceMeta'

/**
 * 投稿先サービス(枠): わんコメのサービス一覧の先頭の id を使う
 * - 成功した id は使い回す(毎回 /services を叩かない)
 * - 失敗(取得不可・枠なし)は一定時間やり直さず null を返す(頻繁に呼ばれても通信しない)
 */
const RETRY_COOLDOWN_MS = 3000

let servicePromise: Promise<string | null> | null = null
let failedAt = 0

export function getPostServiceId(): Promise<string | null> {
  if (servicePromise) return servicePromise
  if (Date.now() - failedAt < RETRY_COOLDOWN_MS) return Promise.resolve(null)

  servicePromise = ServiceMetaWatcher.getInstance()
    .fetchServices()
    .then((services) => services[0]?.id ?? null)
    .catch((e) => {
      console.error(e)
      return null
    })
    .then((id) => {
      if (!id) resetPostServiceId(true)
      return id
    })
  return servicePromise
}

/** 取得済みの id を捨てる(枠が変わった・投稿に失敗したとき) */
export function resetPostServiceId(markFailed = false): void {
  servicePromise = null
  if (markFailed) failedAt = Date.now()
}
