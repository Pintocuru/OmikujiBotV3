// src/common/LayerImage/useImageSources.ts
import { computed, ref, watch } from 'vue'
import { getImagePath } from '@/common/AppEnv'

export function useImageSources(layers: () => string[] | string) {
  const errorIndexes = ref(new Set<number>())

  const rawLayers = computed(() => (typeof layers() === 'string' ? [layers() as string] : (layers() as string[])))

  const sources = computed(() =>
    rawLayers.value
      .map((l, i) => ({ l, i }))
      .filter(({ l, i }) => l && !errorIndexes.value.has(i))
      .map(({ l, i }) => ({ src: getImagePath(l), index: i }))
  )

  const onError = (index: number) => {
    // Set を作り直して代入し、確実に再活性化させる
    errorIndexes.value = new Set(errorIndexes.value).add(index)
  }

  watch(rawLayers, () => errorIndexes.value.clear())

  return { sources, onError }
}
