// src/games/scripts/game/GoogolClover/execute.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { prepareUserInfo } from '@/games/shared/rankingMessage'
import { parseQueryString } from '@/games/shared/parseQueryString'
import { executeGame } from './sub/game'
import { buildPostActions } from './sub/postActionBuilder'
import { UserState } from './sub/types'

export class ExecuteScript implements ScriptClass {
  private readonly userStates = new Map<string, UserState>()

  /**
   * ゲームを実行する
   */
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const {} = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    // ゲームの実行
    const gameResult = executeGame(this.userStates, user)

    // PostActionの構築
    const postActions = buildPostActions({
      bubble: gameResult.bubble,
      score: gameResult.rankingMessage.slots.score,
      characterKey,
    })

    return {
      actions: postActions,
      rankingMessages: [gameResult.rankingMessage],
    }
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const {} = this.parseParams(queryString)
    const user = prepareUserInfo()

    const gameResult = executeGame(this.userStates, user)
    return gameResult.bubble
  }

  /**
   * パラメータをパース
   */
  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }
}

export default new ExecuteScript()
