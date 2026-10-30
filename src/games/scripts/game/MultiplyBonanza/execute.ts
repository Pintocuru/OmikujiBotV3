// src/games/scripts/game/MultiplyBonanza/execute.ts
import { ScenarioStepMessageSchema, ScenarioStepType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { GameEngine } from './game'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/shared/rankingMessage'
import { parseQueryString } from '@/games/shared/parseQueryString'
import { WordPartySelector } from './wordPartySelector'

export class ExecuteScript implements ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    // ゲームの実行
    const gameResult = this.executeGame(user.userName, params.mode)

    // ゲーム結果に基づいてWordPartyを生成
    const wordPartyActions = this.selectWordParties(gameResult.result)

    // omiken(コメント)がある場合のみランキング用メッセージを付与
    const rankingMessages = omiken
      ? [
          buildBotMessageRanking({
            user,
            score: gameResult.result.payout,
            symbol: gameResult.result.symbol,
          }),
        ]
      : []

    return {
      steps: this.buildPostActions(gameResult, wordPartyActions, characterKey),
      rankingMessages,
    }
  }

  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const user = prepareUserInfo()
    return this.executeGame(user.userName, mode).message
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
   * WordPartyの選択
   */
  private selectWordParties(gameResult: ReturnType<GameEngine['playGame']>): ScenarioStepType[] {
    const selector = new WordPartySelector()
    return selector.selectWordParties(gameResult)
  }

  /**
   * ステップ の構築
   */
  private buildPostActions(
    gameResult: {
      result: ReturnType<GameEngine['playGame']>
      message: string
    },
    wordPartyActions: ScenarioStepType[],
    characterKey: string | null
  ): ScenarioStepType[] {
    const messageAction = ScenarioStepMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: gameResult.message,
      sound: 'decision',
    })

    return [
      { kind: 'wordParty', delaySeconds: 1, repeat: 1, wordPartyId: gameResult.result.party },
      { kind: 'wordParty', delaySeconds: 3.2, repeat: 1, wordPartyId: 'MultiplyBonanzaCracker1' },
      ...wordPartyActions,
      messageAction,
    ]
  }
}

export default new ExecuteScript()
