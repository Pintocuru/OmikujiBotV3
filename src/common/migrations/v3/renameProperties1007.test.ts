// src/common/migrations/v3/renameProperties1007.test.ts
import { describe, expect, it } from 'vitest'
import { DATA_VERSION_3_0000001007, migrateRenameProperties1007 } from './renameProperties1007'

const legacy = () => ({
  meta: { dataVersion: 3.0000001006, name: 'x' },
  events: {
    comments: [{ id: 'e1', omikujiKey: 'box1', trigger: { conditions: ['username'], userName: ['a', 'b'], access: [] } }],
    timers: [{ id: 't1', omikujiKey: 'box1', mode: 'interval' }],
  },
  assets: {
    mikuji: {
      box1: {
        omikuji: [
          { kind: 'steps', stepKey: 'sc1', lottery: { isPriority: false, criteria: { userName: ['z'] } } },
          { kind: 'control', command: 'return', lottery: { isPriority: true, criteria: null } },
        ],
      },
    },
    scenarios: {
      sc1: {
        steps: {
          s1: { id: 's1', kind: 'message', characterKey: null, message: 'hi' },
          s2: { id: 's2', kind: 'gameScript', scriptId: 'CommentBot', characterKey: null },
          s3: { id: 's3', kind: 'message', characterKey: 'ch1', message: 'ok' },
        },
      },
    },
    characters: {
      ch1: { image: { default: { src: ['a.png'], animation: { type: 'bounce', duration: 2, loop: true } } } },
    },
  },
})

describe('migrateRenameProperties1007', () => {
  it('プロパティ名を新しい名前に変換し、dataVersion を更新する', () => {
    const out: any = migrateRenameProperties1007(legacy())
    expect(out.meta.dataVersion).toBe(DATA_VERSION_3_0000001007)
    expect(out.meta.name).toBe('x')

    const trigger = out.events.comments[0].trigger
    expect(trigger.usernames).toEqual(['a', 'b'])
    expect('userName' in trigger).toBe(false)
    expect(out.events.comments[0].mikujiKey).toBe('box1')
    expect('omikujiKey' in out.events.comments[0]).toBe(false)
    expect(out.events.timers[0].mikujiKey).toBe('box1')

    const [steps, control] = out.assets.mikuji.box1.omikuji
    expect(steps.kind).toBe('scenario')
    expect(steps.scenarioKey).toBe('sc1')
    expect('stepKey' in steps).toBe(false)
    expect(steps.lottery.criteria.usernames).toEqual(['z'])
    expect(control.lottery.criteria).toBeNull()

    const s = out.assets.scenarios.sc1.steps
    expect(s.s1.characterKey).toBe('')
    expect(s.s2.scriptKey).toBe('CommentBot')
    expect('scriptId' in s.s2).toBe(false)
    expect(s.s2.characterKey).toBe('')
    expect(s.s3.characterKey).toBe('ch1')

    const anim = out.assets.characters.ch1.image.default.animation
    expect(anim.durationSeconds).toBe(2)
    expect('duration' in anim).toBe(false)
  })

  it('入力データを書き換えない', () => {
    const input = legacy()
    migrateRenameProperties1007(input)
    expect(input).toEqual(legacy())
  })

  it('新しい名前が既にある場合はそちらを優先する', () => {
    const input: any = legacy()
    input.assets.mikuji.box1.omikuji[0].scenarioKey = 'new'
    input.events.timers[0].mikujiKey = 'newBox'
    const out: any = migrateRenameProperties1007(input)
    expect(out.assets.mikuji.box1.omikuji[0].scenarioKey).toBe('new')
    expect(out.events.timers[0].mikujiKey).toBe('newBox')
  })

  it('assets / events が無いデータでも落ちない', () => {
    const out: any = migrateRenameProperties1007({ meta: {} })
    expect(out.meta.dataVersion).toBe(DATA_VERSION_3_0000001007)
    expect('assets' in out).toBe(false)
  })
})
