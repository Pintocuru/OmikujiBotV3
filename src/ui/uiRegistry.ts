// src/ui/uiRegistry.ts
import type { Component } from 'vue'
import { UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * レイアウト用UI
 */
export type UiLoader = () => Promise<{ default: Component }>
type LayoutKey = NonNullable<UiLayoutType>
const layouts: Partial<Record<LayoutKey, UiLoader>> = {}

// レジストリ操作
export const registerLayout = (map: Partial<Record<LayoutKey, UiLoader>>) => Object.assign(layouts, map)
export const getLayoutLoader = (key: LayoutKey) => layouts[key]

// UIコンポーネントのレジストリ
const loaders: Partial<Record<UiKind, UiLoader>> = {}
export const registerUi = (map: Partial<Record<UiKind, UiLoader>>) => Object.assign(loaders, map)
export const getUiLoader = (kind: UiKind) => loaders[kind]
