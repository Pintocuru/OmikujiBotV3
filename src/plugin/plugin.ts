// src/plugin/plugin.ts
import { OnePlugin, PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'
import { APP_VERSION } from '@/version'
import { processOmikenComment } from '@/sdk/subscribe/OmikenComment/OmikenCommentProcessor'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { PLUGIN_KEY, PLUGIN_NAME } from '@/types/env'
import { pluginRequest } from '@server/adapters/pluginAdapter'
import { recordUserComment, resetCommentUsers } from '@server/core/services/userListService'

const plugin: OnePlugin = {
  name: `${PLUGIN_NAME}`,
  uid: PLUGIN_KEY,
  version: APP_VERSION,
  author: 'Pintocuru',
  url: 'https://pintocuru.booth.pm/items/8025642',
  permissions: ['filter.comment', 'clear'],
  defaultState: {},

  async init(api, initialData) {
    try {
      postSystemMessage(`【${PLUGIN_NAME}】を起動しました`, { username: '__INFO__' })
    } catch (error) {
      console.error('Plugin initialization failed:', error)
      postSystemMessage(`プラグインの初期化に失敗しました: ${error}`)
      throw error
    }
  },

  async filterComment(comment, service, userData) {
    const omiken = processOmikenComment(comment)
    if (!omiken) return comment

    // コメントしたユーザーを、サーバーのユーザーリスト (LiveConsole 用) に記録する
    recordUserComment(omiken)

    // コメント自体はそのまま返す
    return comment
  },

  // わんコメの「クリア」で、コメント由来のユーザーリストを空にする (手動の操作結果・手動ユーザーは残す)
  subscribe(type) {
    if (type === 'clear') resetCommentUsers()
  },

  async request(req: PluginRequest): Promise<PluginResponse> {
    return await pluginRequest(req)
  },
  destroy() {
    postSystemMessage(`【${PLUGIN_NAME}】を終了しました`, { username: '__INFO__' })
  },
}

export default plugin
