// src/editor/assets/scenarios/composables/useSoundFiles.ts
import { onMounted, ref } from 'vue'
import { soundApi } from '@/manager/services/soundApi'

// 全コンポーネントで共有 (ステップごとに API を叩かない)
const soundFiles = ref<string[]>([])
let loaded = false

async function load(force = false) {
  if (loaded && !force) return
  try {
    // core/ はプリセットで選べるので除外
    soundFiles.value = (await soundApi.getSoundList()).filter((p) => !p.startsWith('core/'))
    loaded = true
  } catch {
    // サーバ未起動 → 空。loaded は立てず、次回マウント時に再試行する
    soundFiles.value = []
  }
}

/**
 * sounds フォルダの音声ファイル一覧 (サーバが動いていないときは空)
 */
export function useSoundFiles() {
  onMounted(() => load())
  return { soundFiles, reload: () => load(true) }
}
