// src/games/scripts/game/HugEmAll/execute.ts
import { PostFlowMessageSchema, PostFlowType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { GameEngine } from './game'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/shared/rankingMessage'
import { parseQueryString } from '@/games/shared/parseQueryString'

export class ExecuteScript implements ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    // ゲームの実行
    const gameResult = this.executeGame(user.userName, params.mode)

    // omiken(コメント)がある場合のみランキング用メッセージを付与
    const rankingMessages = omiken
      ? [
          buildBotMessageRanking({
            user,
            score: gameResult.result.payout,
            symbol: '',
          }),
        ]
      : []

    return {
      actions: this.buildPostActions(characterKey, gameResult.message),
      rankingMessages,
    }
  }

  sampleRun(queryString: string): string {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo()
    return this.executeGame(user.userName, params.mode).message
  }

  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }

  /**
   * ゲームの実行
   */
  private executeGame(userName: string, mode: GameParams['mode']) {
    const engine = new GameEngine()
    const result = engine.playGame(mode)
    const message = engine.createMessage(userName, result)

    return {
      result,
      message,
    }
  }

  /**
   * PostAction の構築
   */
  private buildPostActions(characterKey: string | null, bubbleText: string): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: bubbleText,
      sound: 'decision',
    })

    return [
      // TODO:演出の作成
      messageAction,
    ]
  }
}

export default new ExecuteScript()
