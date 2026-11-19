// src/console/consoleRegistry.ts
// LiveConsole の画面のレジストリ。UI の uiRegistry.ts と同じ形式 (key → loader) で、
// 表示名・カテゴリ・起動方式は consoleViewMap (ConsoleViewMap.ts) にある
import type { Component } from 'vue'
import { consoleViewMap, type ConsoleViewKey } from '@/console/maps/ConsoleViewMap'

export type ConsoleViewLoader = () => Promise<{ default: Component }>

const loaders: Partial<Record<ConsoleViewKey, ConsoleViewLoader>> = {}

// レジストリ操作 (使う画面だけを、パッケージの console.ts などから登録する)
export const registerConsoleView = (map: Partial<Record<ConsoleViewKey, ConsoleViewLoader>>) =>
  Object.assign(loaders, map)
export const getConsoleViewLoader = (key: ConsoleViewKey) => loaders[key]

/** 登録されている画面のキー。並び順は consoleViewMap の並び順 */
export const getConsoleViewKeys = (): ConsoleViewKey[] =>
  (Object.keys(consoleViewMap) as ConsoleViewKey[]).filter((key) => loaders[key])
