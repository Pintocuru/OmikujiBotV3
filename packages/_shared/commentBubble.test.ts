// packages/_shared/commentBubble.test.ts
import { describe, it, expect } from 'vitest'
import { getLayoutLoader, getUiLoader } from '@/ui/uiRegistry'
import { registerCommentBubble } from './commentBubble'

describe('registerCommentBubble', () => {
  it('UI と layout の両方に commentBubble を登録する(ストロベリーショコラ)', () => {
    registerCommentBubble()
    expect(getUiLoader('commentBubble')).toBeTypeOf('function')
    expect(getLayoutLoader('commentBubble')).toBeTypeOf('function')
  })
})
