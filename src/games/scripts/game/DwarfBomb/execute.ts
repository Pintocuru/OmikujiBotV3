// src/games/scripts/game/DwarfBomb/execute.ts
import { ScenarioStepMessageSchema, ScenarioStepType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/shared/rankingMessage'
import { parseQueryString } from '@/games/shared/parseQueryString'
import { generatePartyEffects, playGame } from './game/game'
import { buildVariableStep } from '@/games/shared/variableStep'
import { OUTPUT_DAY, OUTPUT_PAYOUT } from './meta'

export class ExecuteScript implements ScriptClass {
  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    const result = playGame(user.userName, params.mode)
    const partyEffects = generatePartyEffects(result)

    // omiken(コメント)がある場合のみランキング用メッセージを付与
    const rankingMessages = omiken
      ? [
          buildBotMessageRanking({
            user,
            score: result.payout,
            symbol: '',
          }),
        ]
      : []

    // 結果を変数に書き込む(後続ステップで [[dwarfbomb_payout_<<userId>>]] のように表示できる)
    const variableStep = buildVariableStep(
      [
        { variable: OUTPUT_PAYOUT, value: result.payout },
        { variable: OUTPUT_DAY, value: result.day },
      ],
      omiken?.userId
    )

    return {
      steps: [variableStep, ...this.buildSteps(partyEffects, characterKey, result.message)],
      rankingMessages,
    }
  }

  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const user = prepareUserInfo()
    return playGame(user.userName, mode).message
  }

  private parseParams(queryString: string): GameParams {
    return GameParamsSchema.parse(parseQueryString(queryString))
  }

  private buildSteps(
    partyEffects: ScenarioStepType[],
    characterKey: string,
    bubbleText: string
  ): ScenarioStepType[] {
    const messageAction = ScenarioStepMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: bubbleText,
      sound: 'decision',
    })

    return [
      // TODO:WordPartyに頼らない演出にする
      { kind: 'wordParty', delaySeconds: 1, repeat: 1, wordPartyId: 'DwarfBombRabbit1' },
      { kind: 'wordParty', delaySeconds: 1.5, repeat: 1, wordPartyId: 'DwarfBombRabbit2' },
      { kind: 'wordParty', delaySeconds: 2, repeat: 1, wordPartyId: 'DwarfBombRabbit3' },
      { kind: 'wordParty', delaySeconds: 2.7, repeat: 1, wordPartyId: 'CommonBombFire' },
      ...partyEffects,
      messageAction,
    ]
  }
}

export default new ExecuteScript()
