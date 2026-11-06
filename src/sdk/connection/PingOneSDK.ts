// src/sdk/connection/PingOneSDK.ts
import axios from 'axios'
import { POST_SETTINGS } from '@/sdk/PostSettings'

const MAX_RETRIES = 3
const TIMEOUT_MS = 3000
const RETRY_BASE_DELAY_MS = 500

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * わんコメにpingする
 * リトライ前提なので、共通の api クライアント(失敗のたびに console.error を出す)は使わない
 */
export async function PingOneSDK(): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 2xx 以外は axios が例外にする。タイムアウトも axios 側で打ち切る
      await axios.get(`${POST_SETTINGS.baseUrl}/info`, { timeout: TIMEOUT_MS })
      console.info('わんコメ起動OK')
      return true
    } catch (err) {
      console.warn(`Ping失敗 (attempt ${attempt}/${MAX_RETRIES})`, err)
    }

    // 最終試行でなければ待機して再試行 (500ms → 1000ms)
    if (attempt < MAX_RETRIES) await sleep(RETRY_BASE_DELAY_MS * attempt)
  }

  console.error('わんコメ接続なし')
  return false
}
