// src/maps/ui/ToastWidgetsMap.ts
import type { ToastComponent } from '@/types/ui'

/**
 * トースト ToastWidgets
 */

export const toastComponentMap: Record<ToastComponent, { label: string }> = {
  standard: {
    label: 'スタンダード(チャット風)',
  },
  simple: {
    label: 'シンプル(角丸ラベル)',
  },
  card: {
    label: 'カード(アクセントライン付き)',
  },
}
