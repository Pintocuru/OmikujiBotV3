// src/common/buildValidation/validateAgainstBuild.test.ts
import { describe, it, expect, vi } from 'vitest'
import { OmikujiDataSchema } from '@/types/OmikujiData'
import { registerLayout, registerUi } from '@/ui/uiRegistry'
import { registerGameScript } from '@/games/gameScriptRegistry'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { reportDataMismatch, validateAgainstBuild } from './validateAgainstBuild'

vi.mock('@/common/SweetAlert2/SweetAlert2Toast', () => ({
  swalModal: { error: vi.fn() },
  swalToast: { error: vi.fn() },
}))
vi.mock('@/sdk/post/PostOneComme', () => ({ postSystemMessage: vi.fn(() => Promise.resolve()) }))

// このテスト用のビルド: commentBubble の UI とレイアウト、GouseiSuika だけを登録
const stub = () => Promise.resolve({ default: {} as never })
registerUi({ commentBubble: stub })
registerLayout({ commentBubble: stub })
registerGameScript({ GouseiSuika: () => Promise.resolve({ default: {} as never }) })

const makeData = (overrides: object = {}) => OmikujiDataSchema.parse(overrides)

const withGameScript = (scriptId: string) => ({
  assets: {
    actions: {
      a1: { id: 'a1', name: 'a1', postFlows: [{ kind: 'gameScript', scriptId }] },
    },
  },
})

describe('validateAgainstBuild', () => {
  it('登録済みのキーだけなら空配列', () => {
    const data = makeData({ ui: { layout: 'commentBubble', settings: { commentBubble: {} } }, ...withGameScript('GouseiSuika') })
    expect(validateAgainstBuild(data)).toEqual([])
  })

  it('未登録の UI 種別を検出する', () => {
    const data = makeData({ ui: { settings: { toastWidgets: {} } } })
    expect(validateAgainstBuild(data)).toContainEqual({ type: 'ui', key: 'toastWidgets' })
  })

  it('未登録のレイアウトを検出する', () => {
    const data = makeData({ ui: { layout: 'gameRanking' } })
    expect(validateAgainstBuild(data)).toContainEqual({ type: 'layout', key: 'gameRanking' })
  })

  it('未登録の gameScript と、存在しない scriptId を検出する', () => {
    expect(validateAgainstBuild(makeData(withGameScript('DwarfBomb')))).toContainEqual({ type: 'gameScript', key: 'DwarfBomb' })
    expect(validateAgainstBuild(makeData(withGameScript('NoSuchScript')))).toContainEqual({ type: 'gameScript', key: 'NoSuchScript' })
  })
})

describe('reportDataMismatch', () => {
  it('画面表示と postSystemMessage の両方で、キー名つきのエラーを伝える', () => {
    reportDataMismatch([{ type: 'layout', key: 'gameRanking' }])
    expect(swalModal.error).toHaveBeenCalled()
    expect(postSystemMessage).toHaveBeenCalledWith(expect.stringContaining('gameRanking'), expect.anything())

    reportDataMismatch([{ type: 'gameScript', key: 'DwarfBomb' }], { display: 'toast' })
    expect(swalToast.error).toHaveBeenCalled()
  })
})
