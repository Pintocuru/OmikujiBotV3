// src/editor/helpers/shared/processTestPlaceholder.ts
import { PlaceholderType } from '@/types/OmikujiData'
import { DisplayVariableResolver } from '@/engine/DisplayVariable/DisplayVariableResolver'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { ContentPlaceholder } from '@/engine/ContentPlaceholder/processor'
import { PlaceholderContext } from '@/engine/ContentPlaceholder/context'
import { getDefaultPlaceholdersShortLabels } from '@/maps/engine/placeholder/DefaultPlaceholderMap'
import i18n from '@/editor/i18n'

/**
 * テスト用：メッセージのプレースホルダーを処理して bubble を返す
 * (本番と同じ順: <<placeholder>> → [[変数]]。変数は空なので、[[ ]] は解決されずに残る)
 */
export const processTestPlaceholder = (
  message: string,
  placeholders: Record<string, PlaceholderType>
): { text: string; hasError: boolean } => {
  try {
    // プレースホルダー
    const contentPlaceholder = new ContentPlaceholder(placeholders)
    const context = new PlaceholderContext()
    context.updateValues(getDefaultPlaceholdersShortLabels((key) => i18n.global.t(key)))
    contentPlaceholder.updateResolvedValues(context.getAll())
    const withPlaceholders = contentPlaceholder.processText(message)

    // 参照 [[変数]]
    const displayVariable = new DisplayVariableResolver(new PlaceholderVariable())
    const text = displayVariable.resolve(withPlaceholders)

    // 解決できなかった [[ ]] が残っていればエラー
    const hasError = /\[\[[\s\S]*?\]\]/.test(text)

    return { text, hasError }
  } catch {
    return {
      text: message,
      hasError: true,
    }
  }
}
