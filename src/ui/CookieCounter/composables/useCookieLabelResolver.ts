// src/ui/CookieCounter/composables/useCookieLabelResolver.ts
import { LIVER_TEXT_LABELS } from '@/ui/StreamCounter/composables/DefaultLabels'
import type { StreamDefaultKey } from '@/ui/types'

/**
 * CookieCounter 専用ラベル解決
 * - default → LIVER_TEXT_LABELS（テキスト固定）
 * - variable → variableLabels から解決
 */
export function useCookieLabelResolver(variableLabels: Record<string, string>) {
  const getLabel = (type: 'default' | 'variable', target: string, label?: string): string => {
    switch (type) {
      case 'default':
        return (label || LIVER_TEXT_LABELS[target as StreamDefaultKey]) ?? target

      case 'variable':
        return (label || variableLabels[target]) ?? target
    }
  }

  return { getLabel }
}
