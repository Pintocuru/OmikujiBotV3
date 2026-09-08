// src/sdk/connection/PingOneSDK.ts
import { api } from "../client";

const MAX_RETRIES = 3;
const TIMEOUT_MS = 3000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * わんコメにpingする
 */
export async function PingOneSDK(): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await api.get(`/info`, { signal: controller.signal });

      clearTimeout(timeout);

      if (response.status === 200) {
        console.info("わんコメ起動OK");
        return true;
      }
    } catch (err) {
      console.warn(`Ping失敗 (attempt ${attempt}/${MAX_RETRIES})`, err);
    }

    // 最終試行でなければ待機して再試行
    if (attempt < MAX_RETRIES) {
      await sleep(500 * attempt); // 500ms → 1000ms
    }
  }

  console.error("わんコメ接続なし");
  return false;
}
