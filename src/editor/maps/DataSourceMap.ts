// src/editor/maps/DataSourceMap.ts
import type { DataSource } from '@/editor/types'

export const DATA_SOURCE_MAP: Record<DataSource, { label: string; class: string }> = {
  api: {
    label: 'プリセット',
    class: 'badge-success',
  },
  local: {
    label: 'omikujiData.js',
    class: 'badge-info',
  },
  unknown: {
    label: 'NO DATA',
    class: 'badge-ghost',
  },
}
