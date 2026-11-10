// src/ui/ToastWidgets/components/standard/register.ts
import type { ToastComponentOf } from '@/types/ui'
import { registerToastWidgetsComponents, type ToastWidgetsComponent } from '../../ToastWidgetsRegistry'

/**
 * ToastWidgets 標準セット
 */
const standardComponents = {
  standard: { labelKey: 'uiComponents.toastWidgets.standard.label', loader: () => import('./Standard.vue') },
  simple: { labelKey: 'uiComponents.toastWidgets.simple.label', loader: () => import('./Simple.vue') },
  card: { labelKey: 'uiComponents.toastWidgets.card.label', loader: () => import('./Card.vue') },
} satisfies Record<ToastComponentOf<'standard'>, ToastWidgetsComponent>

export const registerStandardToastComponents = () => registerToastWidgetsComponents({ standard: standardComponents })
