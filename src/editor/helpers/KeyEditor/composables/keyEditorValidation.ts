// src/editor/helpers/KeyEditor/composables/keyEditorValidation.ts
import i18n from '@/editor/i18n'

const t = (key: string) => i18n.global.t(key)

/**
 * Keyの基本フォーマットバリデーション
 */
function validateKeyFormat(key: string): string | null {
  const trimmedKey = key.trim()
  if (!trimmedKey) return t('keyEditor.validation.required')
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedKey)) return t('keyEditor.validation.format')
  return null
}

/**
 * Key重複チェック（existingKeys は同カテゴリの全 Key。自分自身は currentKey で除外）
 */
function validateKeyDuplication(
  key: string,
  existingKeys: readonly string[],
  currentKey: string
): string | null {
  if (key === currentKey) return null
  return existingKeys.includes(key) ? t('keyEditor.validation.duplicate') : null
}

/**
 * 統合Keyバリデーション
 */
export function validateKey(key: string, existingKeys: readonly string[], currentKey: string): string {
  const trimmedKey = key.trim()
  return validateKeyFormat(trimmedKey) ?? validateKeyDuplication(trimmedKey, existingKeys, currentKey) ?? ''
}
