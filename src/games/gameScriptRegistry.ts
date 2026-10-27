// src/games/gameScriptRegistry.ts
import type { ScriptClass } from '@/games/types'
import { gameScriptKeys, type GameScriptKey } from '@/types/OmikujiData'

export type GameScriptLoader = () => Promise<{ default: ScriptClass }>

const loaders: Partial<Record<GameScriptKey, GameScriptLoader>> = {}

export const registerGameScript = (map: Partial<Record<GameScriptKey, GameScriptLoader>>) => Object.assign(loaders, map)

export const getGameScriptLoader = (key: GameScriptKey) => loaders[key]

// 登録済みのキーだけ(gameScriptKeys の並び順を維持)
export const getRegisteredGameScriptKeys = (): GameScriptKey[] => gameScriptKeys.filter((key) => key in loaders)
