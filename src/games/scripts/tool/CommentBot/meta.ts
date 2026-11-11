// src/games/scripts/tool/CommentBot/meta.ts
import { COMMENT_THEME_KEYS, MOCK_USER_POOL_MAX } from '@/common/MockUser'
import type { GameScriptMeta } from '@/games/types'
import { DEFAULT_THEME, DEFAULT_USER_COUNT } from './params'

// 投稿するだけのスクリプトなので、書き込む変数はない
export const commentBotMeta: GameScriptMeta = {
  inputs: [
    { key: 'theme', type: 'enum', options: COMMENT_THEME_KEYS, default: DEFAULT_THEME },
    { key: 'name', type: 'text' },
    { key: 'comments', type: 'text' }, // , 区切り
    { key: 'users', type: 'number', min: 1, max: MOCK_USER_POOL_MAX, default: DEFAULT_USER_COUNT },
  ],
  outputs: [],
}
