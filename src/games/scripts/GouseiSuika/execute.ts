// src/games/scripts/GouseiSuika/execute.ts
import { PostFlowMessageSchema, PostFlowType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/scriptsEngine/RankingMessage/RankingMessage'
import { parseQueryString } from '@/games/parseQueryString'
import { GachaGame } from './game'

export class ExecuteScript implements ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const gameResult = new GachaGame(params).play()

    const user = prepareUserInfo(omiken)
    const bubbleText = `${user.userName}の得点は${gameResult.points}!`

    // omiken(コメント)がある場合のみランキング用メッセージを付与
    const botMessageExtras = omiken
      ? [
          buildBotMessageRanking({
            user,
            bubbleText,
            score: gameResult.points,
            symbol: params.mode,
            isOverLimit: false,
          }),
        ]
      : []

    return {
      actions: this.buildPostActions(gameResult.postArray, characterKey, bubbleText),
      botMessageExtras,
    }
  }

  sampleRun(queryString: string): string {
    const params = this.parseParams(queryString)
    const gameResult = new GachaGame(params).play()
    return `[ユーザー名]の得点は${gameResult.points}!`
  }

  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }

  /**
   * PostAction の構築
   */
  private buildPostActions(postArray: PostFlowType[], characterKey: string | null, bubbleText: string): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: bubbleText,
      sound: 'decision',
    })

    return [...postArray, messageAction]
  }
}

export default new ExecuteScript()
