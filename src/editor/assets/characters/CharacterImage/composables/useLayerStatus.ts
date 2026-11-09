// src/editor/assets/characters/CharacterImage/composables/useLayerStatus.ts
import { onBeforeUnmount, ref, watch } from 'vue'
import { getImagePath } from '@/common/AppEnv'
import { probeMedia } from './probeMedia'

/** 空 / 確認中 / 読み込めた / 読み込めない */
export type LayerStatus = 'empty' | 'checking' | 'loaded' | 'error'

/** 入力が止まってから確認を始めるまでの待ち (1文字ごとに通信しない) */
const CHECK_DELAY_MS = 400

/**
 * レイヤー1枚ぶんのパスが読み込めるかを、編集画面だけで確かめる (配信表示側の LayerImage は変えない)
 */
export function useLayerStatus(getPath: () => string) {
  const status = ref<LayerStatus>('empty')
  let timer: ReturnType<typeof setTimeout> | undefined
  let token = 0 // 古い確認の結果で上書きしないための世代番号

  watch(
    getPath,
    (path) => {
      clearTimeout(timer)
      token++
      if (!path.trim()) {
        status.value = 'empty'
        return
      }
      status.value = 'checking'
      const current = token
      timer = setTimeout(async () => {
        const ok = await probeMedia(getImagePath(path))
        if (current === token) status.value = ok ? 'loaded' : 'error'
      }, CHECK_DELAY_MS)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    clearTimeout(timer)
    token++
  })

  return { status }
}
