// src/editor/assets/characters/CharacterImage/composables/useImageFiles.ts
import { ref } from 'vue'
import { imageApi } from '@/manager/services/imageApi'

// 全コンポーネントで共有 (レイヤーごとに API を叩かない)
const imageFiles = ref<string[]>([])
const isLoading = ref(false)
let loaded = false
let pending: Promise<void> | null = null

async function load(force = false): Promise<void> {
  if (loaded && !force) return
  if (pending) return pending

  isLoading.value = true
  pending = (async () => {
    try {
      imageFiles.value = await imageApi.getImageList()
      loaded = true
    } catch {
      // サーバ未接続 → 空。loaded は立てず、次に開いたときに再試行する (手入力・読み込み確認で続けられる)
      imageFiles.value = []
    } finally {
      isLoading.value = false
      pending = null
    }
  })()
  return pending
}

/**
 * サーバの画像一覧 (サーバが動いていない・images フォルダが無いときは空)
 * ensureLoaded は取得が終わるまで待つ。取得済みなら通信しない
 */
export function useImageFiles() {
  return { imageFiles, isLoading, ensureLoaded: () => load(), reload: () => load(true) }
}
