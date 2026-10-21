// src/generator/scripts/trigger/checkers/UserCheckers.test.ts
import { describe, expect, it, vi } from 'vitest'
import { checkUsername } from './UserCheckers'

describe('checkUsername', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  it('パターンなし・空行のみなら常に true', () => {
    expect(checkUsername('hoge')).toBe(true)
    expect(checkUsername('hoge', [])).toBe(true)
    expect(checkUsername('hoge', ['', '  '])).toBe(true)
  })

  it('通常指定: いずれかの正規表現にマッチしたときだけ true', () => {
    expect(checkUsername('hoge', ['^hoge$'])).toBe(true)
    expect(checkUsername('fuga', ['^hoge$'])).toBe(false)
    expect(checkUsername('fuga', ['^hoge$', '^fuga$'])).toBe(true)
  })

  it('空行が混ざっても全員許可にならない', () => {
    expect(checkUsername('fuga', ['^hoge$', ''])).toBe(false)
  })

  it('除外指定 (!): マッチしたら false、除外のみなら他は true', () => {
    expect(checkUsername('admin', ['!admin'])).toBe(false)
    expect(checkUsername('hoge', ['!admin'])).toBe(true)
    expect(checkUsername('hoge', ['!admin', '!test'])).toBe(true)
  })

  it('許可と除外の併用: 除外が優先', () => {
    expect(checkUsername('hoge_admin', ['^hoge', '!admin'])).toBe(false)
    expect(checkUsername('hoge_user', ['^hoge', '!admin'])).toBe(true)
    expect(checkUsername('other', ['^hoge', '!admin'])).toBe(false)
  })

  it('不正な正規表現は例外なくマッチしない扱い', () => {
    expect(checkUsername('hoge', ['('])).toBe(false)
    expect(checkUsername('hoge', ['!('])).toBe(true)
  })

  it('名前が空なら (パターンがある場合) false', () => {
    expect(checkUsername('', ['^hoge$'])).toBe(false)
  })
})
