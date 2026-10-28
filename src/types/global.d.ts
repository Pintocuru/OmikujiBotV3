// src/types/global.d.ts
import type { OmikujiDataType } from './OmikujiData/OmikujiDataSchema'

// グローバル変数の型定義
declare global {
  interface Window {
    omikujiData?: OmikujiDataType
    OmikujiBot?: {
      mountGenerator?: () => void
      mountEditor?: () => void
      mountConsole?: () => void
      assetBase?: string
    }
  }
}
