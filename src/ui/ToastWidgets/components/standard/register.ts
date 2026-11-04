// src/ui/ToastWidgets/components/standard/register.ts
import type { ToastComponentOf } from '@/types/ui'
import { registerToastWidgetsComponents, type ToastWidgetsComponent } from '../../ToastWidgetsRegistry'

/**
 * ToastWidgets 標準セット
 */
const standardComponents = {
  standard: { label: 'スタンダード(チャット風)', loader: () => import('./Standard.vue') },
  simple: { label: 'シンプル(角丸ラベル)', loader: () => import('./Simple.vue') },
  card: { label: 'カード(アクセントライン付き)', loader: () => import('./Card.vue') },
} satisfies Record<ToastComponentOf<'standard'>, ToastWidgetsComponent>

export const registerStandardToastComponents = () => registerToastWidgetsComponents({ standard: standardComponents })
