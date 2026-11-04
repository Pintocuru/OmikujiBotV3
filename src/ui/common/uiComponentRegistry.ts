// src/ui/common/uiComponentRegistry.ts
import type { Component } from 'vue'

export type UiComponentLoader = () => Promise<{ default: Component }>

/** 共通項目(label / loader)+ UI 固有メタ。メタは共通側では解釈しない。 */
export type UiComponentDefinition<TMeta extends object = object> = {
  label: string
  loader: UiComponentLoader
} & TMeta

export type UiComponentSet<TMeta extends object = object> = Record<string, UiComponentDefinition<TMeta>>
export type UiComponentSets<TMeta extends object = object> = Record<string, UiComponentSet<TMeta>>

type Stored = UiComponentDefinition<object>

// uiName → setName → id → 定義
const registries = new Map<string, Map<string, Map<string, Stored>>>()

const ID_PATTERN = /^[a-z][A-Za-z0-9]*$/
const ERR = '[UI Component Registry]'

/** UI 内部の表示コンポーネントをセット単位で登録する。 */
export function registerUiComponents<TMeta extends object>(uiName: string, sets: UiComponentSets<TMeta>): void {
  const current = registries.get(uiName) ?? new Map<string, Map<string, Stored>>()

  // 置き換え対象外のセットが持つ ID(重複検査用): id → セット名
  const owner = new Map<string, string>()
  for (const [setName, defs] of current) {
    if (Object.hasOwn(sets, setName)) continue
    for (const id of defs.keys()) owner.set(id, setName)
  }

  // 検証しながら次の状態を組み立てる(途中で throw しても current は無傷)
  const next = new Map<string, Map<string, Stored>>()
  for (const [setName, defs] of Object.entries(sets)) {
    const entries = new Map<string, Stored>()
    for (const [id, def] of Object.entries(defs)) {
      if (!ID_PATTERN.test(id)) {
        throw new Error(`${ERR} Invalid component ID "${id}" in ${uiName}/${setName}`)
      }
      const other = owner.get(id)
      if (other !== undefined) {
        throw new Error(`${ERR} Duplicate component ID "${id}" in ${uiName}: ${other} and ${setName}`)
      }
      owner.set(id, setName)
      entries.set(id, def)
    }
    next.set(setName, entries)
  }

  for (const [setName, defs] of next) current.set(setName, defs)
  registries.set(uiName, current)
}

export function getUiComponentSets<TMeta extends object = object>(uiName: string): UiComponentSets<TMeta> {
  const sets = registries.get(uiName)
  if (!sets) return {}
  return Object.fromEntries(
    [...sets].map(([setName, defs]) => [setName, Object.fromEntries(defs)])
  ) as UiComponentSets<TMeta>
}

export function getUiComponent<TMeta extends object = object>(
  uiName: string,
  id: string
): UiComponentDefinition<TMeta> | undefined {
  for (const defs of registries.get(uiName)?.values() ?? []) {
    const def = defs.get(id)
    if (def) return def as UiComponentDefinition<TMeta>
  }
  return undefined
}

export const hasUiComponent = (uiName: string, id: string): boolean => getUiComponent(uiName, id) !== undefined
