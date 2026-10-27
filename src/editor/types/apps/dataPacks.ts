// src/editor/types/apps/dataPacks.ts
import { MetaDataType } from '@/types/core'

// 型定義
export interface DataPackEntry {
  path: string
  rawUrl: string
  bannerUrl: string | null
  meta: MetaDataType
  json: Record<string, unknown>
}
