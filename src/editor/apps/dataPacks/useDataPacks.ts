// src/editor/apps/dataPacks/useDataPacks.ts
import { ref, computed } from 'vue'
import axios from 'axios'
import { MetaDataType } from '@/types/core'
import { DataPackEntry } from '@/editor/types'
import { templateList, REPO_BASE } from '@/editor/constants'

// JSON ローダー
async function loadTemplateJson(rawUrl: string): Promise<Record<string, unknown>> {
  const response = await axios.get<Record<string, unknown>>(rawUrl, {
    responseType: 'json',
    timeout: 5000,
  })
  return response.data
}

// composable
export function useDataPacks() {
  const packs = ref<DataPackEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedTags = ref<string[]>([])

  // 全パックから重複なくタグを収集
  const allTags = computed<string[]>(() => {
    const tagSet = new Set<string>()

    for (const pack of packs.value) {
      for (const tag of pack.meta.tags ?? []) {
        tagSet.add(tag)
      }
    }
    return [...tagSet].sort()
  })

  // 選択タグで絞り込み（未選択時は全件）
  const filteredPacks = computed<DataPackEntry[]>(() => {
    if (selectedTags.value.length === 0) return packs.value
    return packs.value.filter((pack) => selectedTags.value.every((tag) => pack.meta.tags?.includes(tag)))
  })

  function toggleTag(tag: string) {
    const idx = selectedTags.value.indexOf(tag)
    if (idx === -1) {
      selectedTags.value = [...selectedTags.value, tag]
    } else {
      selectedTags.value = selectedTags.value.filter((t) => t !== tag)
    }
  }

  function clearTags() {
    selectedTags.value = []
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    packs.value = []

    const results: DataPackEntry[] = []

    for (const path of templateList) {
      const rawUrl = `${REPO_BASE}/${path}`

      try {
        const json = await loadTemplateJson(rawUrl)
        const meta = (json.meta ?? {}) as MetaDataType

        results.push({
          path,
          rawUrl,
          bannerUrl: rawUrl.replace(/\.json$/, '.webp'),
          meta,
          json,
        })
      } catch (err) {
        console.error(`[useDataPacks] Failed to load: ${rawUrl}`, err)
        // 1件失敗しても続行
      }
    }

    packs.value = results
    loading.value = false
  }

  const isEmpty = computed(() => !loading.value && packs.value.length === 0)

  return {
    packs: filteredPacks,
    loading,
    error,
    isEmpty,
    fetchAll,
    allTags,
    selectedTags,
    toggleTag,
    clearTags,
  }
}
