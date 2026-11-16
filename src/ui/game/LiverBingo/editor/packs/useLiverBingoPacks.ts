// src/ui/LiverBingo/editor/packs/useLiverBingoPacks.ts
import { ref } from 'vue'
import axios from 'axios'
import {
  LIVER_BINGO_PACK_BASE,
  LIVER_BINGO_PACK_INDEX_URL,
  LiverBingoPackIndexSchema,
  LiverBingoPackSchema,
  type LiverBingoPackInfoType,
  type LiverBingoPackType,
} from './LiverBingoPackSchema'

const TIMEOUT_MS = 5000

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await axios.get<unknown>(url, { responseType: 'json', timeout: TIMEOUT_MS })
  return response.data
}

/**
 * お題パックを GitHub から取得する
 * - 一覧(index.json)を先に読み、パック本体は選んだときだけ読む
 * - 読み込んだパックは覚えておき、同じものを選び直しても取りに行かない
 */
export const useLiverBingoPacks = () => {
  const packs = ref<LiverBingoPackInfoType[]>([])
  const loading = ref(false)
  /** 一覧を読めなかったか(通信失敗・形式が違う) */
  const failed = ref(false)

  const cache = new Map<string, LiverBingoPackType>()

  const loadIndex = async () => {
    loading.value = true
    failed.value = false
    try {
      packs.value = LiverBingoPackIndexSchema.parse(await fetchJson(LIVER_BINGO_PACK_INDEX_URL)).packs
    } catch (error) {
      console.error('[useLiverBingoPacks] Failed to load index', error)
      packs.value = []
      failed.value = true
    } finally {
      loading.value = false
    }
  }

  /** パック本体を取得する。読めなかった(通信失敗・形式が違う)ときは null */
  const loadPack = async (file: string): Promise<LiverBingoPackType | null> => {
    const cached = cache.get(file)
    if (cached) return cached
    try {
      const pack = LiverBingoPackSchema.parse(await fetchJson(`${LIVER_BINGO_PACK_BASE}/${file}`))
      cache.set(file, pack)
      return pack
    } catch (error) {
      console.error(`[useLiverBingoPacks] Failed to load: ${file}`, error)
      return null
    }
  }

  return { packs, loading, failed, loadIndex, loadPack }
}
