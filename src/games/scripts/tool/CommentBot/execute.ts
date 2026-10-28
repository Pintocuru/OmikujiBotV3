// src/games/scripts/tool/CommentBot/execute.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { CommentPickSchema } from '@/types/subscribe'
import { ScriptClass, ScriptResult } from '@/games/types'
import { parseQueryString } from '@/games/shared/parseQueryString'
import { createMockUserPool, MockUserPool, pickTestComment } from '@/common/MockUser'
import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
import { postComment, postSystemMessage } from '@/sdk/post/PostOneComme'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import { getPostServiceId, resetPostServiceId } from '@/sdk/service/getPostServiceId'
import { clampUserCount, DEFAULT_THEME, isCommentThemeKey } from './params'

// BOT 機能: 返り値は常に空
const EMPTY_RESULT: ScriptResult = { actions: [], rankingMessages: [] }

// 頻繁に呼ばれるため、ユーザープールは人数が同じ間は使い回す
let poolCache: { size: number; pool: MockUserPool } | null = null
const getPool = (size: number): MockUserPool => {
  if (poolCache?.size !== size) poolCache = { size, pool: createMockUserPool(size) }
  return poolCache.pool
}

export class ExecuteScript implements ScriptClass {
  /**
   * BOT としてわんコメにコメントを投稿する(いつ呼ぶかは呼び出し側の責務)
   * userId は botUserId 固定: 投稿は BOT のコメントとして扱われ、エンジンの処理対象にならない
   */
  async run(queryString: string, _characterKey: string | null, _omiken?: OmikenCommentType): Promise<ScriptResult> {
    const serviceId = await getPostServiceId()
    if (!serviceId) {
      this.reportError('投稿先の枠を取得できません(わんコメを確認してください)')
      return EMPTY_RESULT
    }

    try {
      await postComment({
        service: { id: serviceId },
        comment: this.buildComment(queryString),
      })
    } catch (error) {
      resetPostServiceId() // 枠が変わった場合に備え、次回は取得し直す
      this.reportError(`コメントの投稿に失敗しました ${error}`)
    }
    return EMPTY_RESULT
  }

  /**
   * サンプルラン
   */
  sampleRun(): string {
    return 'この機能はBOTです(設定した内容をBOTとして自動投稿します)'
  }

  /**
   * クエリから投稿内容を組み立てる(name / comments / theme / users、すべて省略可)
   */
  private buildComment(queryString: string) {
    const params = parseQueryString(queryString)

    const theme = params.theme && isCommentThemeKey(params.theme) ? params.theme : DEFAULT_THEME
    const customComments = (params.comments ?? '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

    const name = params.name?.trim() || getPool(clampUserCount(params.users)).pick('regular').userName

    return CommentPickSchema.parse({
      userId: POST_SETTINGS.botUserId,
      name,
      comment: pickTestComment(theme, customComments),
      profileImage: getAvatarUrl(name),
    })
  }

  // 画面ではなくわんコメに伝える(頻繁に呼ばれるため throttle)
  private reportError(message: string): void {
    console.error(`[CommentBot] ${message}`)
    postSystemMessage(`CommentBot: ${message}`, { speech: false, throttle: true })
  }
}

export default new ExecuteScript()
