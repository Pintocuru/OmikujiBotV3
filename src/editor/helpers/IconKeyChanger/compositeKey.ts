// src/editor/helpers/IconKeyChanger/compositeKey.ts
// iconKey のマッピング・使用回数で使う "characterKey:iconKey" 複合キー(先頭の ':' で分ける。iconKey 側は ':' を含んでよい)

export const toCompositeKey = (characterKey: string, iconKey: string): string => `${characterKey}:${iconKey}`

export const parseCompositeKey = (compositeKey: string): { characterKey: string; iconKey: string } => {
  const i = compositeKey.indexOf(':')
  if (i < 0) return { characterKey: compositeKey, iconKey: '' }
  return { characterKey: compositeKey.slice(0, i), iconKey: compositeKey.slice(i + 1) }
}
