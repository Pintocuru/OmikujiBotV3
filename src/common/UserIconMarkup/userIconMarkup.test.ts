// src/common/UserIconMarkup/userIconMarkup.test.ts
import { describe, expect, it } from 'vitest'
import {
  createUserIconMarkup,
  replaceUserIconMarkup,
  stripLeadingUserIconMarkup,
  stripUserIconMarkup,
} from './userIconMarkup'

describe('userIconMarkup', () => {
  const text = `${createUserIconMarkup('UC-abc_1')}さくら さん、こんにちは ${createUserIconMarkup('xyz')}`

  it('userId を取り出して置き換えられる (userId に - や _ があってもよい)', () => {
    expect(replaceUserIconMarkup(text, (id) => `<${id}>`)).toBe('<UC-abc_1>さくら さん、こんにちは <xyz>')
  })

  it('すべて取り除く / 先頭の1つだけ取り除く', () => {
    expect(stripUserIconMarkup(text)).toBe('さくら さん、こんにちは ')
    expect(stripLeadingUserIconMarkup(text)).toBe(`さくら さん、こんにちは ${createUserIconMarkup('xyz')}`)
  })

  it('アイコンの目印ではない {{ }} には触らない', () => {
    expect(stripUserIconMarkup('{{score}} 点')).toBe('{{score}} 点')
  })
})
