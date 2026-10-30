// src/games/scripts/game/GouseiSuika/execute.ts
import { ScenarioStepMessageSchema, ScenarioStepType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/shared/rankingMessage'
import { parseQueryString } from '@/games/shared/parseQueryString'
import { GachaGame } from './game'

export class ExecuteScript implements ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const gameResult = new GachaGame(params).play()

    const user = prepareUserInfo(omiken)
    const bubbleText = `${user.userName}の得点は${gameResult.points}!`

    // omiken(コメント)がある場合のみランキング用メッセージを付与
    const rankingMessages = omiken
      ? [
          buildBotMessageRanking({
            user,
            score: gameResult.points,
            symbol: params.mode,
          }),
        ]
      : []

    return {
      steps: this.buildPostActions(gameResult.postArray, characterKey, bubbleText),
      rankingMessages,
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
   * ステップ の構築
   */
  private buildPostActions(
    postArray: ScenarioStepType[],
    characterKey: string | null,
    bubbleText: string
  ): ScenarioStepType[] {
    const messageAction = ScenarioStepMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: bubbleText,
      sound: 'decision',
    })

    return [...postArray, messageAction]
  }
}

export default new ExecuteScript()
