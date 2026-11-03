// src/ui/common/uiComponentRegistry.ts
import type { Component } from 'vue'

export type UiComponentLoader = () => Promise<{ default: Component }>
export type UiComponentDefinition<TMeta extends object = Record<string, never>> = {
  label: string
  loader: UiComponentLoader
} & TMeta
export type UiComponentSet<TMeta extends object = Record<string, never>> = Record<string, UiComponentDefinition<TMeta>>
export type UiComponentSets<TMeta extends object = Record<string, never>> = Record<string, UiComponentSet<TMeta>>

type StoredDefinition = UiComponentDefinition<object>
const registries = new Map<string, Map<string, Record<string, StoredDefinition>>>()
const ID_PATTERN = /^[a-z][A-Za-z0-9]*$/

/** UI 内部の表示コンポーネントをセット単位で登録する。 */
export function registerUiComponents<TMeta extends object>(
  uiName: string,
  sets: Record<string, Record<string, UiComponentDefinition<TMeta>>>
): void {
  const current = registries.get(uiName) ?? new Map<string, Record<string, StoredDefinition>>()
  const replacements = new Map<string, Record<string, StoredDefinition>>()

  for (const [setName, definitions] of Object.entries(sets)) {
    const next: Record<string, StoredDefinition> = {}
    for (const [id, definition] of Object.entries(definitions)) {
      if (!ID_PATTERN.test(id)) {
        throw new Error(`[UI Component Registry] Invalid component ID "${id}" in ${uiName}/${setName}`)
      }
      next[id] = definition as StoredDefinition
    }
    replacements.set(setName, next)
  }

  const ids = new Map<string, string>()
  for (const [setName, definitions] of current) {
    if (replacements.has(setName)) continue
    for (const id of Object.keys(definitions)) ids.set(id, setName)
  }
  for (const [setName, definitions] of replacements) {
    for (const id of Object.keys(definitions)) {
      const existingSet = ids.get(id)
      if (ids.has(id)) {
        throw new Error(`[UI Component Registry] Duplicate component ID "${id}" in ${uiName}: ${existingSet} and ${setName}`)
      }
      ids.set(id, setName)
    }
  }

  for (const [setName, definitions] of replacements) current.set(setName, definitions)
  registries.set(uiName, current)
}

export function getUiComponentSets<TMeta extends object = Record<string, never>>(
  uiName: string
): Record<string, Record<string, UiComponentDefinition<TMeta>>> {
  return Object.fromEntries(registries.get(uiName) ?? []) as Record<string, Record<string, UiComponentDefinition<TMeta>>>
}

export function getUiComponent<TMeta extends object = Record<string, never>>(
  uiName: string,
  id: string
): UiComponentDefinition<TMeta> | undefined {
  for (const definitions of registries.get(uiName)?.values() ?? []) {
    if (definitions[id]) return definitions[id] as UiComponentDefinition<TMeta>
  }
  return undefined
}
