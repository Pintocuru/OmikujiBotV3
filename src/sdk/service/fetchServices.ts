// src/sdk/service/fetchServices.ts
import { api } from '@/sdk/client'
import type { Service } from '@onecomme.com/onesdk/types/Service'

let cache: { at: number; data: Service[] } | null = null
let inflight: Promise<Service[]> | null = null

/**
 * わんコメの枠一覧(/services)を取得する。
 * - 取得中に呼ばれたら、同じリクエストの結果を共有する
 * - maxAgeMs 未満の結果があれば、それを返す(0 なら常に取得)
 * 取得に失敗したら例外を投げる
 */
export function fetchServices(maxAgeMs = 0): Promise<Service[]> {
  if (cache && Date.now() - cache.at < maxAgeMs) return Promise.resolve(cache.data)
  if (inflight) return inflight

  const request = api
    .get<Service[]>('/services')
    .then((response) => {
      const data = response.data ?? []
      cache = { at: Date.now(), data }
      return data
    })
    .finally(() => {
      if (inflight === request) inflight = null
    })
  inflight = request
  return request
}

/** 枠を作成・削除したときなど、次の取得で最新を取りたいときに呼ぶ */
export function invalidateServicesCache(): void {
  cache = null
}
