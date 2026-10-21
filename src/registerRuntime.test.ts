// src/registerRuntime.test.ts
import { describe, it, expect } from 'vitest'
import { uiKinds, uiLayouts, scriptGameKeys } from '@/types/OmikujiData'
import { getUiLoader, getLayoutLoader } from '@/ui/uiRegistry'
import { getGameScriptLoader } from '@/games/gameScriptRegistry'
import { registerRuntime } from './registerRuntime'

describe('registerRuntime', () => {
  it('src/types の UI 種別・レイアウト・gameScript をすべて登録している', () => {
    registerRuntime()
    expect(uiKinds.filter((kind) => !getUiLoader(kind))).toEqual([])
    expect(uiLayouts.filter((key) => !getLayoutLoader(key))).toEqual([])
    expect(scriptGameKeys.filter((key) => !getGameScriptLoader(key))).toEqual([])
  })
})
