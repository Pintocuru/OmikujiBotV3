// src/editor/helpers/shared/getDefaultPlaceholdersShortLabels.ts
import { defaultPlaceholderLabel } from '@/types/engine'
import type { DefaultPlaceholders } from '@/types/engine'

/**
 * デフォルトプレースホルダーの短縮ラベルを現在の言語で取得
 */
export const getDefaultPlaceholdersShortLabels = (
  translate: (key: string) => string
): Record<DefaultPlaceholders, string> =>
  Object.fromEntries(
    defaultPlaceholderLabel.map((key) => [key, translate(`mapText.defaultPlaceholder.${key}.short`)])
  ) as Record<DefaultPlaceholders, string>
