//
import type { ScriptClass } from '@/games/types'
import { scriptGameKeys, type ScriptGameKey } from '@/types/OmikujiData'

export type GameScriptLoader = () => Promise<{ default: ScriptClass }>

const loaders: Partial<Record<ScriptGameKey, GameScriptLoader>> = {}

export const registerGameScript = (map: Partial<Record<ScriptGameKey, GameScriptLoader>>) => Object.assign(loaders, map)

export const getGameScriptLoader = (key: ScriptGameKey) => loaders[key]

// 登録済みのキーだけ(scriptGameKeys の並び順を維持)
export const getRegisteredGameScriptKeys = (): ScriptGameKey[] => scriptGameKeys.filter((key) => key in loaders)
